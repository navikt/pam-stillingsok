"use client";

import { Box, Heading, HStack, Radio, RadioGroup, Tag, VStack } from "@navikt/ds-react";
import { useState } from "react";
import type { ArticleQuiz as ArticleQuizData, ArticleQuizQuestion } from "@/features/ung/onboarding/domain/article";
import { SafeHtml } from "@/features/ung/onboarding/ui/SafeHtml";

type ArticleQuizProps = Readonly<{
    quiz: ArticleQuizData;
    title?: string;
}>;

type AnswersByQuestion = Readonly<Record<string, string>>;

export function ArticleQuiz({ quiz, title = "Test deg selv" }: ArticleQuizProps) {
    const [answersByQuestion, setAnswersByQuestion] = useState<AnswersByQuestion>({});

    return (
        <Box as="section" aria-labelledby="artikkel-quiz-tittel">
            <VStack gap="space-24">
                <Heading id="artikkel-quiz-tittel" level="2" size="large">
                    {title}
                </Heading>
                {quiz.questions.map((question) => (
                    <QuizQuestion
                        key={question.id}
                        question={question}
                        selectedOptionId={answersByQuestion[question.id]}
                        onAnswer={(optionId) =>
                            setAnswersByQuestion((current) => ({ ...current, [question.id]: optionId }))
                        }
                    />
                ))}
            </VStack>
        </Box>
    );
}

type QuizQuestionProps = Readonly<{
    question: ArticleQuizQuestion;
    selectedOptionId?: string;
    onAnswer: (optionId: string) => void;
}>;

function QuizQuestion({ question, selectedOptionId, onAnswer }: QuizQuestionProps) {
    const selectedOption = question.options.find((option) => option.id === selectedOptionId);
    // Noen quizer er selvevaluering uten fasit (ingen alternativ er markert riktig).
    // Da vises feedback nøytralt, uten "Riktig/Feil svar"-merking.
    const isGraded = question.options.some((option) => option.isCorrect);

    return (
        <VStack gap="space-12">
            <RadioGroup
                legend={question.statement}
                value={selectedOptionId ?? ""}
                onChange={(optionId: string) => onAnswer(optionId)}
            >
                {question.options.map((option) => (
                    <Radio key={option.id} value={option.id}>
                        {option.label}
                    </Radio>
                ))}
            </RadioGroup>

            <div role="status">
                {selectedOption && (
                    <Box
                        background="default"
                        borderColor={
                            isGraded
                                ? selectedOption.isCorrect
                                    ? "success-subtle"
                                    : "danger-subtle"
                                : "neutral-subtle"
                        }
                        borderWidth="4"
                        borderRadius="12"
                        padding={{ xs: "space-16", md: "space-24" }}
                    >
                        <VStack gap="space-12">
                            {isGraded && (
                                <HStack>
                                    <Tag
                                        variant="moderate"
                                        size="small"
                                        data-color={selectedOption.isCorrect ? "success" : "danger"}
                                    >
                                        {selectedOption.isCorrect ? "Riktig svar" : "Feil svar"}
                                    </Tag>
                                </HStack>
                            )}
                            <SafeHtml html={selectedOption.feedbackHtml} />
                        </VStack>
                    </Box>
                )}
            </div>
        </VStack>
    );
}
