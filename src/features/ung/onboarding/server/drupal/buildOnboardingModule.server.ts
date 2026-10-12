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
import {
    type CollectionFilter,
    getSharedContentGoalsParentId,
    type SharedContentClient,
    type TaxonomyTerm,
    type TaxonomyVocabulary,
} from "@/features/ung/onboarding/server/drupal/drupalClient.server";
import { onboardingDefinition } from "@/features/ung/onboarding/server/local/onboardingDefinition";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";

// Appen eier den faste koblingen fra dimensjon til taxonomy-vokabular og Drupal-filterfelt
// (se COLLECTION_FILTER_GROUPS i drupalClient.server.ts).
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
 * Bygger onboarding-modulen fra lokal struktur og tekst samt gjeldende svaralternativer fra
 * taxonomy. Spørsmål uten publiserte termer skjules med en logget advarsel. Hvis et steg ender uten
 * spørsmål, skjules steget på samme måte. Hvis ingen steg har spørsmål igjen, returneres en feil.
 */
export async function buildOnboardingModule(
    client: SharedContentClient,
    /** Overstyrer `SHARED_CONTENT_GOALS_PARENT_ID`-konfigurasjonen. Brukes av mock-kilden, som har
     * sin egen selvstendige taxonomy-fixture og derfor ikke skal avhenge av live-miljøkonfigurasjon. */
    goalsParentIdOverride?: string,
): Promise<SharedContentResult<BuiltOnboardingModule>> {
    let goalsParentId: string | undefined = goalsParentIdOverride;
    if (goalsParentId === undefined) {
        const parentId = getSharedContentGoalsParentId();
        if (!parentId.ok) {
            return parentId;
        }
        goalsParentId = parentId.data;
    }

    const dimensions: readonly FilterDimension[] = ["age", "experience", "audiences"];
    const termResults = await Promise.all([
        client.getTaxonomyTerms(DIMENSION_VOCABULARIES.age),
        client.getTaxonomyTerms(DIMENSION_VOCABULARIES.experience),
        client.getTaxonomyTerms(DIMENSION_VOCABULARIES.audiences, { parentId: goalsParentId }),
    ]);
    for (const termResult of termResults) {
        if (!termResult.ok) {
            return termResult;
        }
    }
    const termsByDimension = new Map<FilterDimension, readonly TaxonomyTerm[]>(
        dimensions.map((dimension, index) => {
            const termResult = termResults[index];
            return [dimension, termResult?.ok ? termResult.data : []];
        }),
    );

    const steps: OnboardingStep[] = [];
    const filterDimensionByQuestionId = new Map<string, FilterDimension>();

    for (const stepDefinition of onboardingDefinition.steps) {
        const questions: OnboardingQuestion[] = [];

        for (const questionDefinition of stepDefinition.questions) {
            const options: AnswerOption[] = [...(termsByDimension.get(questionDefinition.dimension) ?? [])]
                .sort((left, right) => left.weight - right.weight)
                .map((term) => ({
                    id: term.id,
                    label: term.name,
                    ...(term.description ? { description: term.description } : {}),
                }));

            if (options.length === 0) {
                appLogger.warn("Skjuler onboarding-spørsmål uten svaralternativer fra taxonomy", {
                    questionId: questionDefinition.id,
                });
                continue;
            }

            questions.push({
                ...questionDefinition,
                options,
            });
            filterDimensionByQuestionId.set(questionDefinition.id, questionDefinition.dimension);
        }

        if (questions.length === 0) {
            appLogger.warn("Skjuler onboarding-steg uten spørsmål med svaralternativer", {
                stepId: stepDefinition.id,
            });
            continue;
        }
        steps.push({ id: stepDefinition.id, title: stepDefinition.title, questions });
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
                id: onboardingDefinition.id,
                title: onboardingDefinition.title,
                intro: onboardingDefinition.intro,
                resultTitle: onboardingDefinition.resultTitle,
                resultIntro: onboardingDefinition.resultIntro,
                steps,
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
