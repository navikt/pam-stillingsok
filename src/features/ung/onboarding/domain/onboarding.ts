export type SelectionMode = "single" | "multiple";

export type AnswerOption = Readonly<{
    id: string;
    label: string;
    description?: string;
}>;

export type OnboardingQuestion = Readonly<{
    id: string;
    title: string;
    description?: string;
    selectionMode: SelectionMode;
    options: readonly AnswerOption[];
}>;

export type OnboardingModule = Readonly<{
    id: string;
    title: string;
    intro: string;
    resultTitle: string;
    resultIntro: string;
    questions: readonly OnboardingQuestion[];
}>;

export type Selection = Readonly<{
    answerIds: readonly string[];
}>;
