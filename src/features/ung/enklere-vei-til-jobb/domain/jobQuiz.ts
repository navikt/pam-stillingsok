import type { SanitizedHtml } from "@/server/utils/htmlSanitizer";

export type JobQuizOption = Readonly<{
    id: string;
    label: string;
    isCorrect: boolean;
}>;

export type JobQuizFeedback = Readonly<{
    title: string;
    html: SanitizedHtml;
    href: string;
    linkLabel: string;
}>;

export type JobQuizQuestion = Readonly<{
    id: string;
    statement: string;
    options: readonly JobQuizOption[];
    feedback: JobQuizFeedback;
}>;

export type JobQuizSection = Readonly<{
    id: string;
    title: string;
    questions: readonly JobQuizQuestion[];
}>;

export type JobQuiz = Readonly<{
    id: string;
    title: string;
    intro: string;
    sections: readonly JobQuizSection[];
}>;
