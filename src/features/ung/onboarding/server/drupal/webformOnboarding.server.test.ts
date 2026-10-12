import { describe, expect, it } from "vitest";
import {
    AGE_18_OR_OLDER,
    AGE_UNDER_18,
    EXPERIENCE_NONE,
    EXPERIENCE_SOME,
    GOAL_APPLY,
    GOAL_FIND_JOB,
    ONBOARDING_WEBFORM_YAML,
} from "@/features/ung/onboarding/server/drupal/__fixtures__/onboardingWebform";
import {
    MAX_WEBFORM_YAML_LENGTH,
    parseOnboardingWebform,
} from "@/features/ung/onboarding/server/drupal/webformOnboarding.server";

describe("parseOnboardingWebform", () => {
    it("parser steg, spørsmål og valg i Webform-rekkefølge, inkludert radios/select/checkboxes", () => {
        const result = parseOnboardingWebform(ONBOARDING_WEBFORM_YAML);

        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        expect(result.data.steps.map((step) => step.id)).toEqual(["step_about_you", "step_goals"]);

        const [aboutYou, goals] = result.data.steps;
        expect(aboutYou?.questions).toEqual([
            {
                id: "age",
                title: "Hvor gammel er du?",
                controlType: "radios",
                required: true,
                multiple: false,
                dimension: "age",
                termIds: [AGE_UNDER_18, AGE_18_OR_OLDER],
            },
            {
                id: "experience",
                title: "Hva er din situasjon nå?",
                emptyLabel: "Velg situasjon",
                controlType: "select",
                required: true,
                multiple: false,
                dimension: "experience",
                termIds: [EXPERIENCE_NONE, EXPERIENCE_SOME],
            },
        ]);
        expect(goals?.questions).toEqual([
            {
                id: "goals",
                title: "Hva er viktigst for deg nå?",
                description: "Velg ett eller flere alternativer.",
                controlType: "checkboxes",
                required: false,
                multiple: true,
                dimension: "audiences",
                termIds: [GOAL_FIND_JOB, GOAL_APPLY],
            },
        ]);
    });

    it("avviser ukjente interaktive feltyper i stedet for å hoppe stille over dem", () => {
        const yaml = `
step:
  '#type': webform_wizard_page
  '#title': 'Steg'
  comment:
    '#type': textfield
    '#title': 'Skriv noe'
`;
        const result = parseOnboardingWebform(yaml);
        expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
    });

    it("avviser spørsmål utenfor et steg", () => {
        const yaml = `
age:
  '#type': radios
  '#title': 'Hvor gammel er du?'
  '#sc_dimension': age
  '#sc_terms':
    - ${AGE_UNDER_18}
`;
        const result = parseOnboardingWebform(yaml);
        expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
    });

    it("avviser duplikate spørsmåls-ID-er på tvers av steg", () => {
        const yaml = `
step_a:
  '#type': webform_wizard_page
  '#title': 'A'
  age:
    '#type': radios
    '#title': 'Alder'
    '#sc_dimension': age
    '#sc_terms':
      - ${AGE_UNDER_18}
step_b:
  '#type': webform_wizard_page
  '#title': 'B'
  age:
    '#type': radios
    '#title': 'Alder igjen'
    '#sc_dimension': age
    '#sc_terms':
      - ${AGE_18_OR_OLDER}
`;
        const result = parseOnboardingWebform(yaml);
        expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
    });

    it("deduplikerer svaralternativ-ID-er innenfor ett spørsmål", () => {
        // Drupals "elements_combined"-felt kan duplisere hele #sc_terms-lista i praksis
        // (observert i staging). #options har bare de unike verdiene, så dette skal
        // rengjøres stille i stedet for å feile kontrakten.
        const yaml = `
step:
  '#type': webform_wizard_page
  '#title': 'Steg'
  age:
    '#type': radios
    '#title': 'Alder'
    '#sc_dimension': age
    '#sc_terms':
      - ${AGE_UNDER_18}
      - ${AGE_18_OR_OLDER}
      - ${AGE_UNDER_18}
      - ${AGE_18_OR_OLDER}
    '#options':
      ${AGE_UNDER_18}: 'Under 18 år'
      ${AGE_18_OR_OLDER}: '18 år eller eldre'
`;
        const result = parseOnboardingWebform(yaml);
        expect(result).toMatchObject({
            ok: true,
            data: {
                steps: [
                    {
                        questions: [{ termIds: [AGE_UNDER_18, AGE_18_OR_OLDER] }],
                    },
                ],
            },
        });
    });

    it("avviser valg som ikke er deklarert i #sc_terms", () => {
        const yaml = `
step:
  '#type': webform_wizard_page
  '#title': 'Steg'
  age:
    '#type': radios
    '#title': 'Alder'
    '#sc_dimension': age
    '#sc_terms':
      - ${AGE_UNDER_18}
    '#options':
      ${AGE_UNDER_18}: 'Under 18 år'
      ${AGE_18_OR_OLDER}: '18 år eller eldre'
`;
        const result = parseOnboardingWebform(yaml);
        expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
    });

    it("traverserer nestede containere rekursivt", () => {
        const yaml = `
step:
  '#type': webform_wizard_page
  '#title': 'Steg'
  layout_wrapper:
    '#type': container
    age:
      '#type': radios
      '#title': 'Alder'
      '#sc_dimension': age
      '#sc_terms':
        - ${AGE_UNDER_18}
`;
        const result = parseOnboardingWebform(yaml);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data.steps[0]?.questions[0]?.id).toBe("age");
        }
    });

    it("avviser en for stor YAML-fil", () => {
        const hugeYaml = `# ${"a".repeat(MAX_WEBFORM_YAML_LENGTH)}`;
        const result = parseOnboardingWebform(hugeYaml);
        expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
    });

    it("avviser et steg uten spørsmål", () => {
        const yaml = `
step:
  '#type': webform_wizard_page
  '#title': 'Tomt steg'
`;
        const result = parseOnboardingWebform(yaml);
        expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
    });
});
