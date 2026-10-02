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
import { useRef, useState } from "react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import type { JobQuiz as JobQuizData, JobQuizQuestion, JobQuizSection } from "@/features/ung/onboarding/domain/jobQuiz";
import { SafeHtml } from "@/features/ung/onboarding/ui/SafeHtml";

type JobQuizProps = Readonly<{
    quiz: JobQuizData;
    backHref: string;
}>;

type AnswersByQuestion = Readonly<Record<string, string>>;

const SECTION_STYLES = [
    { background: "brand-magenta-soft", color: "brand-magenta" },
    { background: "brand-beige-soft", color: "brand-beige" },
    { background: "success-soft", color: "success" },
    { background: "meta-purple-soft", color: "meta-purple" },
] as const;

export function JobQuiz({ quiz, backHref }: JobQuizProps) {
    const [answersByQuestion, setAnswersByQuestion] = useState<AnswersByQuestion>({});
    const headingRef = useRef<HTMLHeadingElement>(null);
    const questions = quiz.sections.flatMap((section) => section.questions);
    const answeredCount = questions.filter((question) => answersByQuestion[question.id] !== undefined).length;
    const correctCount = countCorrectAnswers(questions, answersByQuestion);
    const isComplete = answeredCount === questions.length;

    function resetQuiz() {
        setAnswersByQuestion({});
        headingRef.current?.focus();
    }

    return (
        <VStack gap={{ xs: "space-24", md: "space-32" }}>
            <div>
                <AkselNextLink href={backHref}>Tilbake til resultater</AkselNextLink>
            </div>

            <VStack gap="space-12">
                <Heading ref={headingRef} tabIndex={-1} level="1" size="xlarge">
                    {quiz.title}
                </Heading>
                <BodyLong size="large">{quiz.intro}</BodyLong>
            </VStack>

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

            <VStack gap="space-8">
                {quiz.sections.map((section, index) => (
                    <QuizSection
                        key={section.id}
                        section={section}
                        answersByQuestion={answersByQuestion}
                        onAnswer={(questionId, optionId) =>
                            setAnswersByQuestion((current) => ({
                                ...current,
                                [questionId]: optionId,
                            }))
                        }
                        style={SECTION_STYLES[index % SECTION_STYLES.length] ?? SECTION_STYLES[0]}
                    />
                ))}
            </VStack>

            {isComplete && (
                <Box as="section" aria-labelledby="jobbquiz-resultat" paddingBlock={{ xs: "space-32", md: "space-48" }}>
                    <VStack gap="space-16" align="center">
                        <Heading id="jobbquiz-resultat" level="2" size="xlarge" align="center">
                            {correctCount} av {questions.length} riktige!
                        </Heading>
                        <BodyLong size="large" align="center">
                            Bra jobbet! Les svarene du gikk glipp av.
                        </BodyLong>
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
    section: JobQuizSection;
    answersByQuestion: AnswersByQuestion;
    onAnswer: (questionId: string, optionId: string) => void;
    style: (typeof SECTION_STYLES)[number];
}>;

function QuizSection({ section, answersByQuestion, onAnswer, style }: QuizSectionProps) {
    const answeredCount = section.questions.filter((question) => answersByQuestion[question.id] !== undefined).length;
    const isComplete = answeredCount === section.questions.length;
    const correctCount = countCorrectAnswers(section.questions, answersByQuestion);

    return (
        <Box as="section" background={style.background} padding={{ xs: "space-16", md: "space-24" }} borderRadius="4">
            <VStack gap="space-24">
                <Heading level="2" size="small" visuallyHidden>
                    {section.title}
                </Heading>
                <HStack gap="space-12" align="center" justify="space-between">
                    <Tag variant="moderate" size="small" data-color={style.color}>
                        {section.title}
                    </Tag>
                    {isComplete && (
                        <BodyShort size="small">
                            {correctCount}/{section.questions.length} riktige
                        </BodyShort>
                    )}
                </HStack>

                {section.questions.map((question) => (
                    <QuizQuestion
                        key={question.id}
                        question={question}
                        sectionTitle={section.title}
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
    question: JobQuizQuestion;
    sectionTitle: string;
    sectionColor: (typeof SECTION_STYLES)[number]["color"];
    selectedOptionId?: string;
    onAnswer: (optionId: string) => void;
}>;

function QuizQuestion({ question, sectionTitle, sectionColor, selectedOptionId, onAnswer }: QuizQuestionProps) {
    const selectedOption = question.options.find((option) => option.id === selectedOptionId);

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

            {selectedOption && (
                <Box
                    background="default"
                    borderColor={selectedOption.isCorrect ? "success-subtle" : "danger-subtle"}
                    borderWidth="4"
                    borderRadius="12"
                    padding={{ xs: "space-16", md: "space-24" }}
                    role="status"
                >
                    <VStack gap="space-12">
                        <HStack gap="space-8">
                            <Tag variant="moderate" size="small" data-color={sectionColor}>
                                {sectionTitle}
                            </Tag>
                            <Tag
                                variant="moderate"
                                size="small"
                                data-color={selectedOption.isCorrect ? "success" : "danger"}
                            >
                                {selectedOption.isCorrect ? "Riktig svar" : "Feil svar"}
                            </Tag>
                        </HStack>
                        <Heading level="3" size="small">
                            {question.feedback.title}
                        </Heading>
                        <SafeHtml html={question.feedback.html} />
                        <div>
                            <AkselNextLink href={question.feedback.href}>{question.feedback.linkLabel}</AkselNextLink>
                        </div>
                    </VStack>
                </Box>
            )}
        </VStack>
    );
}

function countCorrectAnswers(questions: readonly JobQuizQuestion[], answersByQuestion: AnswersByQuestion): number {
    return questions.filter((question) =>
        question.options.some((option) => option.id === answersByQuestion[question.id] && option.isCorrect),
    ).length;
}
