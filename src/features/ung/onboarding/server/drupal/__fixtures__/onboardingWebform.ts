/**
 * Delt onboarding-Webform-fixture: tre spørsmål (age/experience/audiences) fordelt på to steg,
 * brukt av webformOnboarding.server.test.ts, buildOnboardingModule.server.test.ts,
 * liveSharedContentSource.server.test.ts og mock-kilden (for kontraktparitet, se Step 6 i planen).
 * Term-UUID-ene matcher konstantene i testene over.
 */
export const AGE_UNDER_18 = "5be5c5a4-c191-4f00-9ad1-cc4ac365da78";
export const AGE_18_OR_OLDER = "7d074491-7231-4c1c-aef3-bdd917776198";
export const EXPERIENCE_NONE = "0fd8124e-edf2-459d-9986-7fb2167dd3da";
export const EXPERIENCE_SOME = "a2dc822c-1eea-4201-bf2e-bcd61077ca05";
export const GOAL_FIND_JOB = "03c6bc26-0b80-42c0-95aa-d001c6e9c5e2";
export const GOAL_APPLY = "cb90945e-a2c4-4a50-8dcb-438c1fe69764";

export const ONBOARDING_WEBFORM_YAML = `
step_about_you:
  '#type': webform_wizard_page
  '#title': 'Om deg'
  age:
    '#type': radios
    '#title': 'Hvor gammel er du?'
    '#required': true
    '#sc_dimension': age
    '#sc_terms':
      - ${AGE_UNDER_18}
      - ${AGE_18_OR_OLDER}
    '#options':
      ${AGE_UNDER_18}: 'Under 18 år'
      ${AGE_18_OR_OLDER}: '18 år eller eldre'
  experience:
    '#type': select
    '#title': 'Hva er din situasjon nå?'
    '#required': true
    '#empty_option': 'Velg situasjon'
    '#sc_dimension': experience
    '#sc_terms':
      - ${EXPERIENCE_NONE}
      - ${EXPERIENCE_SOME}
    '#options':
      ${EXPERIENCE_NONE}: 'Ingen erfaring'
      ${EXPERIENCE_SOME}: 'Litt erfaring'
step_goals:
  '#type': webform_wizard_page
  '#title': 'Mål'
  goals:
    '#type': checkboxes
    '#title': 'Hva er viktigst for deg nå?'
    '#description': 'Velg ett eller flere alternativer.'
    '#sc_dimension': audiences
    '#sc_terms':
      - ${GOAL_FIND_JOB}
      - ${GOAL_APPLY}
    '#options':
      ${GOAL_FIND_JOB}: 'Finne en jobb'
      ${GOAL_APPLY}: 'Søke på en stilling'
  submit:
    '#type': webform_actions
`;
