import type {
    OnboardingModule,
    OnboardingQuestion,
    OnboardingStep,
} from "@/features/ung/enklere-vei-til-jobb/domain/onboarding";

type OnboardingQuestionDefinition = Omit<OnboardingQuestion, "options">;

type OnboardingStepDefinition = Omit<OnboardingStep, "questions"> &
    Readonly<{
        questions: readonly OnboardingQuestionDefinition[];
    }>;

export type OnboardingDefinition = Omit<OnboardingModule, "steps"> &
    Readonly<{
        steps: readonly OnboardingStepDefinition[];
    }>;

export const onboardingDefinition: OnboardingDefinition = {
    id: "enklere-vei-til-jobb",
    title: "Staging demo: Finn innhold som passer deg",
    intro: "Velg det som ligner mest på situasjonen din, så finner du råd som kan passe. Dette er en demonstrasjon av et skjema med tre steg.",
    resultTitle: "Jobb for deg",
    resultIntro: "Her finner du stillinger og tips som passer situasjonen din.",
    steps: [
        {
            id: "age_step",
            title: "Alder",
            questions: [
                {
                    id: "age",
                    title: "Hvor gammel er du?",
                    controlType: "radios",
                    required: false,
                    multiple: false,
                    dimension: "age",
                },
            ],
        },
        {
            id: "experience_step",
            title: "Erfaring",
            questions: [
                {
                    id: "experience",
                    title: "Hva er din situasjon nå?",
                    controlType: "radios",
                    required: true,
                    multiple: false,
                    dimension: "experience",
                },
            ],
        },
        {
            id: "goals_step",
            title: "Dine mål",
            questions: [
                {
                    id: "goals",
                    title: "Hva er viktigst for deg nå?",
                    controlType: "checkboxes",
                    required: false,
                    multiple: true,
                    dimension: "audiences",
                },
            ],
        },
    ],
};
