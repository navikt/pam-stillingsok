import type { ArticleQuizQuestion } from "@/features/ung/enklere-vei-til-jobb/domain/article";

export type AnswersByQuestion = Readonly<Record<string, string>>;

export function isGradedQuestion(question: ArticleQuizQuestion): boolean {
    return question.options.some((option) => option.isCorrect);
}

export function countCorrectAnswers(
    questions: readonly ArticleQuizQuestion[],
    answersByQuestion: AnswersByQuestion,
): number {
    return questions.filter((question) =>
        question.options.some((option) => option.id === answersByQuestion[question.id] && option.isCorrect),
    ).length;
}
