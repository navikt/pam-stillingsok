import "server-only";
import { appLogger } from "@/app/_common/logging/appLogger";
import type {
    AnswerOption,
    OnboardingModule,
    OnboardingQuestion,
    Selection,
} from "@/features/ung/onboarding/domain/onboarding";
import {
    type CollectionFilter,
    getSharedContentGoalsParentId,
    type SharedContentClient,
    type TaxonomyTerm,
    type TaxonomyVocabulary,
} from "@/features/ung/onboarding/server/drupal/drupalClient.server";
import { onboardingModule } from "@/features/ung/onboarding/server/local/onboardingModule";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";

/** Hvilket filterfelt et spørsmåls svar skal filtreres på i `getCollection()`. */
export type FilterDimension = keyof CollectionFilter;

// Spørsmålstekstene ligger lokalt (server/local/onboardingModule.ts) og endres ikke her.
// Bare koblingen mellom spørsmål-ID og taxonomy-vokabular/filterfelt avgjøres i denne filen.
const QUESTION_DIMENSIONS: Readonly<Record<string, FilterDimension>> = {
    "question-age": "age",
    "question-situation": "experience",
    "question-goals": "audiences",
};

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
 * Bygger onboarding-modulen ved å hente svaralternativene fra taxonomy og sette dem inn i de
 * lokale spørsmålene. Spørsmål uten valg (tomt vokabular) skjules og logges som advarsel. Hvis
 * ingen spørsmål har valg etter dette, returneres en feil (jf. beslutning #2 i planen: viser feilsiden
 * i stedet for en tom veiviser).
 */
export async function buildOnboardingModule(
    client: SharedContentClient,
): Promise<SharedContentResult<BuiltOnboardingModule>> {
    const goalsParentId = getSharedContentGoalsParentId();
    if (!goalsParentId.ok) {
        return goalsParentId;
    }

    const [ageTerms, experienceTerms, goalTerms] = await Promise.all([
        client.getTaxonomyTerms(DIMENSION_VOCABULARIES.age),
        client.getTaxonomyTerms(DIMENSION_VOCABULARIES.experience),
        client.getTaxonomyTerms(DIMENSION_VOCABULARIES.audiences, { parentId: goalsParentId.data }),
    ]);

    if (!ageTerms.ok) {
        return ageTerms;
    }
    if (!experienceTerms.ok) {
        return experienceTerms;
    }
    if (!goalTerms.ok) {
        return goalTerms;
    }

    const termsByQuestionId: Readonly<Record<string, readonly TaxonomyTerm[]>> = {
        "question-age": ageTerms.data,
        "question-situation": experienceTerms.data,
        "question-goals": goalTerms.data,
    };

    const questions: OnboardingQuestion[] = [];
    const filterDimensionByQuestionId = new Map<string, FilterDimension>();

    for (const question of onboardingModule.questions) {
        const terms = termsByQuestionId[question.id] ?? [];
        if (terms.length === 0) {
            appLogger.warn("Skjuler onboarding-spørsmål uten svaralternativer fra taxonomy", {
                questionId: question.id,
            });
            continue;
        }

        const options: readonly AnswerOption[] = [...terms]
            .sort((a, b) => a.weight - b.weight)
            .map((term) => ({ id: term.id, label: term.name }));
        questions.push({ ...question, options });

        const dimension = QUESTION_DIMENSIONS[question.id];
        if (dimension) {
            filterDimensionByQuestionId.set(question.id, dimension);
        }
    }

    if (questions.length === 0) {
        return {
            ok: false,
            error: {
                type: "invalid-response",
                message: "Ingen av onboarding-spørsmålene har svaralternativer fra taxonomy",
            },
        };
    }

    return {
        ok: true,
        data: {
            module: { ...onboardingModule, questions },
            filterDimensionByQuestionId,
        },
    };
}

/**
 * Grupperer valgte svar-ID-er etter filterfelt. `decodeSelectionParams()` har allerede avvist
 * svar-ID-er som ikke finnes blant modulens gyldige valg, så oppslaget her er bare et sikkerhetsnett:
 * ukjente ID-er faller ut i stedet for å sendes videre til Drupal.
 */
export function buildCollectionFilter(built: BuiltOnboardingModule, selection: Selection): CollectionFilter {
    const answerIdsByDimension: Record<FilterDimension, string[]> = {
        age: [],
        experience: [],
        audiences: [],
    };

    const questionByAnswerId = new Map(
        built.module.questions.flatMap((question) => question.options.map((option) => [option.id, question] as const)),
    );

    for (const answerId of selection.answerIds) {
        const question = questionByAnswerId.get(answerId);
        if (!question) {
            continue;
        }
        const dimension = built.filterDimensionByQuestionId.get(question.id);
        if (!dimension) {
            continue;
        }
        answerIdsByDimension[dimension].push(answerId);
    }

    return {
        ...(answerIdsByDimension.age.length > 0 ? { age: answerIdsByDimension.age } : {}),
        ...(answerIdsByDimension.experience.length > 0 ? { experience: answerIdsByDimension.experience } : {}),
        ...(answerIdsByDimension.audiences.length > 0 ? { audiences: answerIdsByDimension.audiences } : {}),
    };
}
