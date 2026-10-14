/** Drupal-feltet et spørsmåls svar filtreres på i `getCollection()`. Fast, lukket sett. */
export type FilterDimension = "age" | "experience" | "audiences";

/** Kontrolltypen spørsmålet rendres med i onboarding-veiviseren. */
export type ControlType = "radios" | "checkboxes";

export type AnswerOption = Readonly<{
    id: string;
    label: string;
    description?: string;
}>;

export type OnboardingQuestion = Readonly<{
    /** Stabil lokal ID, brukt som URL-parameternavn. */
    id: string;
    title: string;
    description?: string;
    controlType: ControlType;
    required: boolean;
    multiple: boolean;
    dimension: FilterDimension;
    options: readonly AnswerOption[];
}>;

export type OnboardingStep = Readonly<{
    /** Stabil lokal ID. */
    id: string;
    title: string;
    questions: readonly OnboardingQuestion[];
}>;

export type OnboardingModule = Readonly<{
    /** Stabil lokal ID. */
    id: string;
    title: string;
    intro: string;
    /** Lokal presentasjonstekst: Shared Content leverer ikke resultattekster. */
    resultTitle: string;
    resultIntro: string;
    steps: readonly OnboardingStep[];
}>;

/** Svarene på ett onboarding-spørsmål. `dimension` følger med for enkel URL-koding, men filterbygging
 * skal ALDRI stole på denne: den skal alltid slå opp feltets dimensjon i den validerte modulen. */
export type SelectedAnswer = Readonly<{
    dimension: FilterDimension;
    optionIds: readonly string[];
}>;

/** Svar gruppert per spørsmåls-ID. */
export type Selection = Readonly<Record<string, SelectedAnswer>>;

export function onboardingQuestions(module: OnboardingModule): readonly OnboardingQuestion[] {
    return module.steps.flatMap((step) => step.questions);
}

/** Første alternativ for enkeltvalgsspørsmål. Flervalg har ingen standardvalg (starter tomt). */
export function defaultSingleOptionId(question: OnboardingQuestion): string | undefined {
    return question.multiple ? undefined : question.options[0]?.id;
}

/** Standardvalg for alle spørsmål i modulen: enkeltvalg får første alternativ, flervalg er tomme. */
export function defaultSelection(module: OnboardingModule): Selection {
    const selection: Record<string, SelectedAnswer> = {};
    for (const question of onboardingQuestions(module)) {
        const optionId = defaultSingleOptionId(question);
        if (optionId) {
            selection[question.id] = { dimension: question.dimension, optionIds: [optionId] };
        }
    }
    return selection;
}
