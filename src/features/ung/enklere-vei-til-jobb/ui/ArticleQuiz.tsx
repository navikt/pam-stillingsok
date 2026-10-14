"use client";

import {
    BodyLong,
    BodyShort,
    Box,
    Button,
    Heading,
    HStack,
    ProgressBar,
    Radio,
    RadioGroup,
    Stack,
    Tag,
    VStack,
} from "@navikt/ds-react";
import { useId, useRef, useState } from "react";
import type {
    ArticleQuiz as ArticleQuizData,
    ArticleQuizQuestion,
    ArticleQuizSection,
    ArticleQuizTheme,
} from "@/features/ung/enklere-vei-til-jobb/domain/article";
import { SafeHtml } from "@/features/ung/enklere-vei-til-jobb/ui/SafeHtml";
import styles from "./ArticleQuiz.module.css";

type ArticleQuizProps = Readonly<{
    quiz: ArticleQuizData;
    title?: string;
}>;

type AnswersByQuestion = Readonly<Record<string, string>>;

const SECTION_STYLES = {
    rose: { className: styles.rose, color: "brand-magenta" },
    peach: { className: styles.peach, color: "brand-beige" },
    mint: { className: styles.mint, color: "success" },
    lavender: { className: styles.lavender, color: "meta-purple" },
} as const satisfies Readonly<Record<ArticleQuizTheme, QuizSectionStyle>>;

const DEFAULT_SECTION_STYLE = { className: undefined, color: "neutral" } as const;

type QuizSectionStyle = Readonly<{
    className?: string;
    color: "brand-magenta" | "brand-beige" | "success" | "meta-purple" | "neutral";
}>;

export function ArticleQuiz({ quiz, title = "Test deg selv" }: ArticleQuizProps) {
    const [answersByQuestion, setAnswersByQuestion] = useState<AnswersByQuestion>({});
    const sectionRef = useRef<HTMLElement>(null);
    const questions = quiz.sections.flatMap((section) => section.questions);
    const answeredCount = questions.filter((question) => answersByQuestion[question.id] !== undefined).length;
    const correctCount = countCorrectAnswers(questions, answersByQuestion);
    const isComplete = answeredCount === questions.length;
    const isFullyGraded = questions.every(isGradedQuestion);

    function resetQuiz() {
        setAnswersByQuestion({});
        sectionRef.current?.focus();
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
                            onAnswer={(questionId, optionId) =>
                                setAnswersByQuestion((current) => ({
                                    ...current,
                                    [questionId]: optionId,
                                }))
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
                                Bra jobbet! Les svarene du gikk glipp av.
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

type QuizSectionProps = Readonly<{
    section: ArticleQuizSection;
    fallbackTitle: string;
    answersByQuestion: AnswersByQuestion;
    onAnswer: (questionId: string, optionId: string) => void;
}>;

function QuizSection({ section, fallbackTitle, answersByQuestion, onAnswer }: QuizSectionProps) {
    const headingId = useId();
    const title = section.title ?? fallbackTitle;
    const style = section.theme === undefined ? DEFAULT_SECTION_STYLE : SECTION_STYLES[section.theme];
    const answeredCount = section.questions.filter((question) => answersByQuestion[question.id] !== undefined).length;
    const correctCount = countCorrectAnswers(section.questions, answersByQuestion);
    const isComplete = answeredCount === section.questions.length;
    const isFullyGraded = section.questions.every(isGradedQuestion);

    return (
        <Box
            as={section.title === undefined ? "div" : "section"}
            aria-labelledby={section.title === undefined ? undefined : headingId}
            className={style.className === undefined ? styles.section : `${styles.section} ${style.className}`}
            padding={{ xs: "space-16", md: "space-24" }}
            borderRadius="4"
        >
            <VStack gap="space-24">
                {section.title !== undefined && (
                    <Heading id={headingId} level="3" size="small" visuallyHidden>
                        {title}
                    </Heading>
                )}
                <HStack gap="space-12" align="center" justify="space-between">
                    <Tag variant="moderate" size="small" data-color={style.color}>
                        {title}
                    </Tag>
                    {isComplete && (
                        <BodyShort size="small">
                            {isFullyGraded ? `${correctCount}/${section.questions.length} riktige` : "Alle besvart"}
                        </BodyShort>
                    )}
                </HStack>

                {section.questions.map((question) => (
                    <QuizQuestion
                        key={question.id}
                        question={question}
                        sectionTitle={title}
                        sectionColor={style.color}
                        selectedOptionId={answersByQuestion[question.id]}
                        onAnswer={(optionId) => onAnswer(question.id, optionId)}
                    />
                ))}
            </VStack>
        </Box>
    );
}

type QuizQuestionProps = Readonly<{
    question: ArticleQuizQuestion;
    sectionTitle: string;
    sectionColor: QuizSectionStyle["color"];
    selectedOptionId?: string;
    onAnswer: (optionId: string) => void;
}>;

function QuizQuestion({ question, sectionTitle, sectionColor, selectedOptionId, onAnswer }: QuizQuestionProps) {
    const selectedOption = question.options.find((option) => option.id === selectedOptionId);
    const isGraded = isGradedQuestion(question);

    return (
        <VStack gap="space-12">
            <RadioGroup
                legend={question.statement}
                value={selectedOptionId ?? ""}
                onChange={(optionId: string) => onAnswer(optionId)}
            >
                <Stack gap="space-0 space-24" direction={{ xs: "column", sm: "row" }} wrap={false}>
                    {question.options.map((option) => (
                        <Radio key={option.id} value={option.id}>
                            {option.label}
                        </Radio>
                    ))}
                </Stack>
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
                            <HStack gap="space-8">
                                <Tag variant="moderate" size="small" data-color={sectionColor}>
                                    {sectionTitle}
                                </Tag>
                                {isGraded && (
                                    <Tag
                                        variant="moderate"
                                        size="small"
                                        data-color={selectedOption.isCorrect ? "success" : "danger"}
                                    >
                                        {selectedOption.isCorrect ? "Riktig svar" : "Feil svar"}
                                    </Tag>
                                )}
                            </HStack>
                            <SafeHtml html={selectedOption.feedbackHtml} />
                        </VStack>
                    </Box>
                )}
            </div>
        </VStack>
    );
}

function isGradedQuestion(question: ArticleQuizQuestion): boolean {
    return question.options.some((option) => option.isCorrect);
}

function countCorrectAnswers(questions: readonly ArticleQuizQuestion[], answersByQuestion: AnswersByQuestion): number {
    return questions.filter((question) =>
        question.options.some((option) => option.id === answersByQuestion[question.id] && option.isCorrect),
    ).length;
}
