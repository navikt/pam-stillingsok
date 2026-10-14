import type {
    CollectionFilter,
    SharedContentClient,
    TaxonomyTerm,
    TaxonomyVocabulary,
} from "@/features/ung/enklere-vei-til-jobb/server/drupal/drupalClient.server";

export const MOCK_GOALS_PARENT_ID = "00000000-0000-4000-8000-000000000005";

export const MOCK_AGE_UNDER_18 = "00000000-0000-4000-8000-000000000011";
export const MOCK_AGE_18_OR_OLDER = "00000000-0000-4000-8000-000000000012";
export const MOCK_EXPERIENCE_NONE = "00000000-0000-4000-8000-000000000021";
export const MOCK_EXPERIENCE_SOME = "00000000-0000-4000-8000-000000000022";
export const MOCK_EXPERIENCE_CHANGE = "00000000-0000-4000-8000-000000000023";
export const MOCK_GOAL_FIND_JOB = "00000000-0000-4000-8000-000000000031";
export const MOCK_GOAL_APPLY = "00000000-0000-4000-8000-000000000032";
export const MOCK_GOAL_INTERVIEW = "00000000-0000-4000-8000-000000000033";
export const MOCK_GOAL_RIGHTS = "00000000-0000-4000-8000-000000000034";
export const MOCK_GOAL_SUPPORT = "00000000-0000-4000-8000-000000000035";
export const MOCK_GOAL_WHILE_SEARCHING = "00000000-0000-4000-8000-000000000036";

const MOCK_TAXONOMY: Readonly<Record<TaxonomyVocabulary, readonly TaxonomyTerm[]>> = {
    shared_content_age: [
        { id: MOCK_AGE_UNDER_18, name: "Under 18", weight: 0 },
        { id: MOCK_AGE_18_OR_OLDER, name: "Over 18", weight: 1 },
    ],
    shared_content_experience: [
        { id: MOCK_EXPERIENCE_NONE, name: "Never had a job", weight: 0 },
        { id: MOCK_EXPERIENCE_SOME, name: "Some experience", weight: 1 },
        {
            id: MOCK_EXPERIENCE_CHANGE,
            name: "Has worked before, but is looking for something new",
            weight: 2,
        },
    ],
    situations: [
        {
            id: MOCK_GOAL_FIND_JOB,
            name: "Finne jobber",
            description: "Her er tips til hvordan du kan finne ledige stillinger.",
            weight: 0,
        },
        { id: MOCK_GOAL_SUPPORT, name: "Støtte og hjelp", weight: 0 },
        {
            id: MOCK_GOAL_APPLY,
            name: "Skriv CV og søknad",
            description: "Her finner du tips og verktøy for hjelp til CV og søknad.",
            weight: 1,
        },
        {
            id: MOCK_GOAL_INTERVIEW,
            name: "Forbered deg på intervju",
            description: "Her finner du tips til intervju og verktøy hvor du kan øve på spørsmål.",
            weight: 2,
        },
        {
            id: MOCK_GOAL_WHILE_SEARCHING,
            name: "Mens du søker jobb",
            description: "Her finner du tips til hva du kan gjøre mens du søker jobber.",
            weight: 3,
        },
        {
            id: MOCK_GOAL_RIGHTS,
            name: "Når du har fått jobben",
            description: "Her finner du informasjon om plikter og rettigheter.",
            weight: 4,
        },
    ],
};

export function createMockOnboardingClient(): SharedContentClient {
    return {
        apiUrl: "",
        getCollection: async (_filter?: CollectionFilter) => {
            throw new Error("getCollection er ikke støttet av mock-onboarding-klienten");
        },
        isArticlePublished: async () => {
            throw new Error("isArticlePublished er ikke støttet av mock-onboarding-klienten");
        },
        getArticle: async () => {
            throw new Error("getArticle er ikke støttet av mock-onboarding-klienten");
        },
        getWebformYaml: async () => {
            throw new Error("getWebformYaml er ikke støttet av mock-onboarding-klienten");
        },
        getTaxonomyTerms: async (vocabulary: TaxonomyVocabulary) => ({ ok: true, data: MOCK_TAXONOMY[vocabulary] }),
    };
}
