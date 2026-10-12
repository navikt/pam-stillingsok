import "server-only";
import { appLogger } from "@/app/_common/logging/appLogger";
import type {
    AnswerOption,
    FilterDimension,
    OnboardingModule,
    OnboardingQuestion,
    OnboardingStep,
    Selection,
} from "@/features/ung/onboarding/domain/onboarding";
import { mapArticle } from "@/features/ung/onboarding/server/drupal/articleMapper.server";
import {
    type CollectionFilter,
    getSharedContentGoalsParentId,
    type SharedContentClient,
    type TaxonomyTerm,
    type TaxonomyVocabulary,
} from "@/features/ung/onboarding/server/drupal/drupalClient.server";
import { parseOnboardingWebform } from "@/features/ung/onboarding/server/drupal/webformOnboarding.server";
import { onboardingPresentation } from "@/features/ung/onboarding/server/local/onboardingPresentation";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";

// Appen eier fortsatt den faste koblingen fra dimensjon til taxonomy-vokabular og Drupal-filterfelt
// (se COLLECTION_FILTER_GROUPS i drupalClient.server.ts). Webformen kan bare velge blant disse tre.
const DIMENSION_VOCABULARIES: Readonly<Record<FilterDimension, TaxonomyVocabulary>> = {
    age: "shared_content_age",
    experience: "shared_content_experience",
    audiences: "situations",
};

export type BuiltOnboardingModule = Readonly<{
    module: OnboardingModule;
    /** Filterfeltet hvert synlige spørsmål hører til. Brukes av `buildCollectionFilter`, aldri av UI-et. */
    filterDimensionByQuestionId: ReadonlyMap<string, FilterDimension>;
}>;

/**
 * Bygger onboarding-modulen fra artikkelen (tittel, ingress, Paragraph-blokker), den tilknyttede
 * Webformen (steg og spørsmål) og taxonomy (gjeldende svaralternativer). Henter bare de
 * taxonomy-vokabularene spørsmålene faktisk bruker. Spørsmål der ingen av `#sc_terms` lenger er
 * publisert i taxonomy, skjules med en logget advarsel. Hvis et steg ender uten spørsmål, skjules
 * steget på samme måte. Hvis ingen steg har spørsmål igjen, returneres en feil.
 */
export async function buildOnboardingModule(
    client: SharedContentClient,
    articleId: string,
    /** Overstyrer `SHARED_CONTENT_GOALS_PARENT_ID`-konfigurasjonen. Brukes av mock-kilden, som har
     * sin egen selvstendige taxonomy-fixture og derfor ikke skal avhenge av live-miljøkonfigurasjon. */
    goalsParentIdOverride?: string,
): Promise<SharedContentResult<BuiltOnboardingModule>> {
    const articleDocument = await client.getArticle(articleId);
    if (!articleDocument.ok) {
        return articleDocument;
    }

    const article = mapArticle(articleDocument.data, client.apiUrl);
    if (!article.ok) {
        return article;
    }
    if (!article.data.webformId) {
        return {
            ok: false,
            error: {
                type: "invalid-response",
                message: "Onboarding-artikkelen mangler en Webform-relasjon (field_sc_webform)",
            },
        };
    }

    const yaml = await client.getWebformYaml(article.data.webformId);
    if (!yaml.ok) {
        return yaml;
    }

    const parsedWebform = parseOnboardingWebform(yaml.data);
    if (!parsedWebform.ok) {
        return parsedWebform;
    }

    const usedDimensions = [
        ...new Set(parsedWebform.data.steps.flatMap((step) => step.questions.map((question) => question.dimension))),
    ];

    let goalsParentId: string | undefined = goalsParentIdOverride;
    if (usedDimensions.includes("audiences") && goalsParentId === undefined) {
        const parentId = getSharedContentGoalsParentId();
        if (!parentId.ok) {
            return parentId;
        }
        goalsParentId = parentId.data;
    }

    const termResults = await Promise.all(
        usedDimensions.map((dimension) =>
            client.getTaxonomyTerms(
                DIMENSION_VOCABULARIES[dimension],
                dimension === "audiences" ? { parentId: goalsParentId } : undefined,
            ),
        ),
    );
    for (const termResult of termResults) {
        if (!termResult.ok) {
            return termResult;
        }
    }
    const termsByDimension = new Map<FilterDimension, readonly TaxonomyTerm[]>(
        usedDimensions.map((dimension, index) => {
            const termResult = termResults[index];
            return [dimension, termResult?.ok ? termResult.data : []];
        }),
    );

    const steps: OnboardingStep[] = [];
    const filterDimensionByQuestionId = new Map<string, FilterDimension>();

    for (const parsedStep of parsedWebform.data.steps) {
        const questions: OnboardingQuestion[] = [];

        for (const parsedQuestion of parsedStep.questions) {
            const termsById = new Map(
                (termsByDimension.get(parsedQuestion.dimension) ?? []).map((term) => [term.id, term] as const),
            );
            const options: AnswerOption[] = parsedQuestion.termIds.flatMap((termId) => {
                const term = termsById.get(termId);
                return term ? [{ id: term.id, label: term.name }] : [];
            });

            if (options.length === 0) {
                appLogger.warn("Skjuler onboarding-spørsmål uten svaralternativer fra taxonomy", {
                    questionId: parsedQuestion.id,
                });
                continue;
            }

            questions.push({
                id: parsedQuestion.id,
                title: parsedQuestion.title,
                ...(parsedQuestion.description ? { description: parsedQuestion.description } : {}),
                ...(parsedQuestion.emptyLabel ? { emptyLabel: parsedQuestion.emptyLabel } : {}),
                controlType: parsedQuestion.controlType,
                required: parsedQuestion.required,
                multiple: parsedQuestion.multiple,
                dimension: parsedQuestion.dimension,
                options,
            });
            filterDimensionByQuestionId.set(parsedQuestion.id, parsedQuestion.dimension);
        }

        if (questions.length === 0) {
            appLogger.warn("Skjuler onboarding-steg uten spørsmål med svaralternativer", { stepId: parsedStep.id });
            continue;
        }
        steps.push({ id: parsedStep.id, title: parsedStep.title, questions });
    }

    if (steps.length === 0) {
        return {
            ok: false,
            error: {
                type: "invalid-response",
                message: "Ingen av onboarding-stegene har spørsmål med svaralternativer fra taxonomy",
            },
        };
    }

    return {
        ok: true,
        data: {
            module: {
                id: article.data.id,
                title: article.data.title,
                intro: article.data.intro,
                resultTitle: onboardingPresentation.resultTitle,
                resultIntro: onboardingPresentation.resultIntro,
                steps,
                blocks: article.data.blocks,
            },
            filterDimensionByQuestionId,
        },
    };
}

/**
 * Grupperer valgte svar etter filterfelt. Stoler ALDRI på `dimension`-feltet i Selection (som bare
 * er en bekvemmelighet for URL-koding): dimensjonen slås alltid opp i modulens egen validerte
 * spørsmål->dimensjon-mapping, og svar-ID-er som ikke finnes blant spørsmålets gyldige valg
 * (f.eks. etter en modulendring) faller bort i stedet for å sendes videre til Drupal.
 */
export function buildCollectionFilter(built: BuiltOnboardingModule, selection: Selection): CollectionFilter {
    const idsByDimension: Record<FilterDimension, string[]> = { age: [], experience: [], audiences: [] };
    const questionById = new Map(
        built.module.steps.flatMap((step) => step.questions.map((question) => [question.id, question] as const)),
    );

    for (const [fieldId, answer] of Object.entries(selection)) {
        const dimension = built.filterDimensionByQuestionId.get(fieldId);
        const question = questionById.get(fieldId);
        if (!dimension || !question) {
            continue;
        }
        const validOptionIds = new Set(question.options.map((option) => option.id));
        for (const optionId of answer.optionIds) {
            if (validOptionIds.has(optionId)) {
                idsByDimension[dimension].push(optionId);
            }
        }
    }

    return {
        ...(idsByDimension.age.length > 0 ? { age: idsByDimension.age } : {}),
        ...(idsByDimension.experience.length > 0 ? { experience: idsByDimension.experience } : {}),
        ...(idsByDimension.audiences.length > 0 ? { audiences: idsByDimension.audiences } : {}),
    };
}
