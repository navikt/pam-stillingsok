import type {
    CollectionFilter,
    SharedContentClient,
    TaxonomyTerm,
    TaxonomyVocabulary,
} from "@/features/ung/onboarding/server/drupal/drupalClient.server";
import type { JsonApiDocument } from "@/features/ung/onboarding/server/drupal/jsonApi";

/**
 * Mock-onboarding: en liten, selvstendig Webform-fixture (egne UUID-er, ikke delt med
 * buildOnboardingModule.server.test.ts) som kjøres gjennom den ekte parseren og module-builderen
 * (se buildOnboardingModule.server.ts), slik at mock-kilden følger samme kontrakt som live-kilden
 * (Step 6 i implementeringsplanen).
 */
export const MOCK_ONBOARDING_ARTICLE_ID = "00000000-0000-4000-8000-000000000003";
const MOCK_ONBOARDING_WEBFORM_ID = "00000000-0000-4000-8000-000000000004";
/** Mock-klienten ignorerer denne (returnerer alle termene uansett), men `buildOnboardingModule`
 * krever en verdi for "audiences"-dimensjonen. Brukes bare for å unngå at mock-kilden avhenger av
 * SHARED_CONTENT_GOALS_PARENT_ID-konfigurasjonen for live Drupal. */
export const MOCK_GOALS_PARENT_ID = "00000000-0000-4000-8000-000000000005";

export const MOCK_AGE_UNDER_18 = "00000000-0000-4000-8000-000000000011";
export const MOCK_AGE_18_OR_OLDER = "00000000-0000-4000-8000-000000000012";
export const MOCK_EXPERIENCE_NONE = "00000000-0000-4000-8000-000000000021";
export const MOCK_EXPERIENCE_SOME = "00000000-0000-4000-8000-000000000022";
export const MOCK_GOAL_FIND_JOB = "00000000-0000-4000-8000-000000000031";
export const MOCK_GOAL_APPLY = "00000000-0000-4000-8000-000000000032";
export const MOCK_GOAL_INTERVIEW = "00000000-0000-4000-8000-000000000033";
export const MOCK_GOAL_RIGHTS = "00000000-0000-4000-8000-000000000034";
export const MOCK_GOAL_SUPPORT = "00000000-0000-4000-8000-000000000035";

const MOCK_ONBOARDING_WEBFORM_YAML = `
step_about_you:
  '#type': webform_wizard_page
  '#title': 'Om deg'
  age:
    '#type': radios
    '#title': 'Hvor gammel er du?'
    '#required': true
    '#sc_dimension': age
    '#sc_terms':
      - ${MOCK_AGE_UNDER_18}
      - ${MOCK_AGE_18_OR_OLDER}
  experience:
    '#type': select
    '#title': 'Hva er din situasjon nå?'
    '#required': true
    '#empty_option': 'Velg situasjon'
    '#sc_dimension': experience
    '#sc_terms':
      - ${MOCK_EXPERIENCE_NONE}
      - ${MOCK_EXPERIENCE_SOME}
step_goals:
  '#type': webform_wizard_page
  '#title': 'Mål'
  goals:
    '#type': checkboxes
    '#title': 'Hva er viktigst for deg nå?'
    '#description': 'Velg ett eller flere alternativer.'
    '#sc_dimension': audiences
    '#sc_terms':
      - ${MOCK_GOAL_FIND_JOB}
      - ${MOCK_GOAL_APPLY}
      - ${MOCK_GOAL_INTERVIEW}
      - ${MOCK_GOAL_RIGHTS}
      - ${MOCK_GOAL_SUPPORT}
  submit:
    '#type': webform_actions
`;

function mockArticleDocument(): JsonApiDocument {
    return {
        data: {
            type: "node--shared_content",
            id: MOCK_ONBOARDING_ARTICLE_ID,
            attributes: {
                title: "Finn veien din videre",
                field_sc_intro: { value: "Svar på noen spørsmål, så finner vi stillinger og tips som passer deg." },
            },
            relationships: {
                field_sc_content: { data: [] },
                field_sc_webform: { data: { type: "webform--webform", id: MOCK_ONBOARDING_WEBFORM_ID } },
            },
        },
        included: [],
    };
}

const MOCK_TAXONOMY: Readonly<Record<TaxonomyVocabulary, readonly TaxonomyTerm[]>> = {
    shared_content_age: [
        { id: MOCK_AGE_UNDER_18, name: "Under 18 år", weight: 1 },
        { id: MOCK_AGE_18_OR_OLDER, name: "18 år eller eldre", weight: 2 },
    ],
    shared_content_experience: [
        { id: MOCK_EXPERIENCE_NONE, name: "Ingen erfaring", weight: 1 },
        { id: MOCK_EXPERIENCE_SOME, name: "Litt erfaring", weight: 2 },
    ],
    situations: [
        { id: MOCK_GOAL_FIND_JOB, name: "Finne en jobb", weight: 1 },
        { id: MOCK_GOAL_APPLY, name: "Søke på en stilling", weight: 2 },
        { id: MOCK_GOAL_INTERVIEW, name: "Forberede meg til intervju", weight: 3 },
        { id: MOCK_GOAL_RIGHTS, name: "Lære om rettighetene mine", weight: 4 },
        { id: MOCK_GOAL_SUPPORT, name: "Få støtte til å søke jobb", weight: 5 },
    ],
};

/** En `SharedContentClient` som bare kan det `buildOnboardingModule` trenger, for mock-kilden. */
export function createMockOnboardingClient(): SharedContentClient {
    return {
        apiUrl: "",
        getCollection: async (_filter?: CollectionFilter) => {
            throw new Error("getCollection er ikke støttet av mock-onboarding-klienten");
        },
        getArticle: async () => ({ ok: true, data: mockArticleDocument() }),
        getWebformYaml: async () => ({ ok: true, data: MOCK_ONBOARDING_WEBFORM_YAML }),
        getTaxonomyTerms: async (vocabulary: TaxonomyVocabulary) => ({ ok: true, data: MOCK_TAXONOMY[vocabulary] }),
    };
}
