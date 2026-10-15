"use client";

import { BodyLong, BodyShort, Box, Button, Heading, HStack, ProgressBar, VStack } from "@navikt/ds-react";
import { useRef, useState } from "react";
import { track } from "@/app/_common/umami";
import type {
    ArticleQuiz as ArticleQuizData,
    ArticleQuizQuestion,
    ArticleQuizSection,
} from "@/features/ung/enklere-vei-til-jobb/domain/article";
import { type AnswersByQuestion, countCorrectAnswers, isGradedQuestion } from "./articleQuizUtils";
import { QuizSection } from "./QuizSection";

export type ArticleQuizProps = Readonly<{
    quiz: ArticleQuizData;
    articleId: string;
    title?: string;
}>;

export function ArticleQuiz({ quiz, articleId, title = "Test deg selv" }: ArticleQuizProps) {
    const [answersByQuestion, setAnswersByQuestion] = useState<AnswersByQuestion>({});
    const sectionRef = useRef<HTMLElement>(null);
    const completionTrackedRef = useRef(false);
    const questions = quiz.sections.flatMap((section) => section.questions);
    const answeredCount = questions.filter((question) => answersByQuestion[question.id] !== undefined).length;
    const correctCount = countCorrectAnswers(questions, answersByQuestion);
    const isComplete = answeredCount === questions.length;
    const isFullyGraded = questions.every(isGradedQuestion);

    function resetQuiz() {
        track("Klikk - Enklere vei til jobb", {
            action: "nullstill-quiz",
            location: "artikkelquiz",
            elementId: articleId,
            elementLabel: "Ta quizen på nytt",
            articleId,
        });
        completionTrackedRef.current = false;
        setAnswersByQuestion({});
        sectionRef.current?.focus();
    }

    function answerQuestion(section: ArticleQuizSection, question: ArticleQuizQuestion, optionId: string) {
        const selectedOption = question.options.find((option) => option.id === optionId);
        if (!selectedOption) {
            return;
        }

        track("Valg - Enklere vei til jobb", {
            location: "artikkelquiz",
            questionId: question.id,
            optionId,
            selected: true,
            sectionId: section.id,
            quizId: articleId,
            ...(isGradedQuestion(question) ? { isCorrect: selectedOption.isCorrect } : {}),
        });

        const nextAnswers = { ...answersByQuestion, [question.id]: optionId };
        if (
            !completionTrackedRef.current &&
            questions.every((quizQuestion) => nextAnswers[quizQuestion.id] !== undefined)
        ) {
            track("Fullført - Enklere vei til jobb-quiz", {
                quizType: "artikkelquiz",
                quizId: articleId,
                totalQuestions: questions.length,
                ...(isFullyGraded ? { correctAnswers: countCorrectAnswers(questions, nextAnswers) } : {}),
            });
            completionTrackedRef.current = true;
        }
        setAnswersByQuestion(nextAnswers);
    }

    return (
        <VStack gap={{ xs: "space-24", md: "space-32" }}>
            {answeredCount > 0 && (
                <HStack gap="space-16" align="center" wrap={false}>
                    <Box flexGrow="1">
                        <ProgressBar
                            value={answeredCount}
                            valueMax={questions.length}
                            size="small"
                            data-color="brand-blue"
                            aria-label={`${answeredCount} av ${questions.length} spørsmål besvart`}
                        />
                    </Box>
                    <BodyShort>
                        {answeredCount}/{questions.length}
                    </BodyShort>
                </HStack>
            )}

            <section ref={sectionRef} tabIndex={-1} aria-labelledby="artikkel-quiz-tittel">
                <Heading id="artikkel-quiz-tittel" level="2" size="small" visuallyHidden>
                    {title}
                </Heading>
                <VStack gap="space-8">
                    {quiz.sections.map((section) => (
                        <QuizSection
                            key={section.id}
                            section={section}
                            fallbackTitle={title}
                            answersByQuestion={answersByQuestion}
                            onAnswer={(question: ArticleQuizQuestion, optionId: string) =>
                                answerQuestion(section, question, optionId)
                            }
                        />
                    ))}
                </VStack>
            </section>

            {isComplete && (
                <Box
                    as="section"
                    aria-labelledby="artikkel-quiz-resultat"
                    paddingBlock={{ xs: "space-32", md: "space-48" }}
                >
                    <VStack gap="space-16" align="center">
                        <Heading id="artikkel-quiz-resultat" level="2" size="xlarge" align="center">
                            {isFullyGraded
                                ? `${correctCount} av ${questions.length} riktige!`
                                : "Du har svart på alle spørsmålene"}
                        </Heading>
                        {isFullyGraded && (
                            <BodyLong size="large" align="center">
                                {correctCount === questions.length
                                    ? "Bra jobbet! Du svarte riktig på alle spørsmålene."
                                    : "Bra jobbet! Les svarene du gikk glipp av."}
                            </BodyLong>
                        )}
                        <Button type="button" variant="secondary" onClick={resetQuiz}>
                            Ta quizen på nytt
                        </Button>
                    </VStack>
                </Box>
            )}
        </VStack>
    );
}
