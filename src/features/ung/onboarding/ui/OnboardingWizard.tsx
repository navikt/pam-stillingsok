"use client";

import {
    BodyLong,
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    FormProgress,
    Heading,
    HStack,
    Radio,
    RadioGroup,
    VStack,
} from "@navikt/ds-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { buildResultHref } from "@/features/ung/onboarding/domain/selectionParams";
import type { OnboardingModule, OnboardingQuestion } from "@/features/ung/onboarding/domain/types";

type OnboardingWizardProps = Readonly<{
    module: OnboardingModule;
}>;

type AnswersByQuestion = Readonly<Record<string, readonly string[]>>;

export function OnboardingWizard({ module }: OnboardingWizardProps) {
    const router = useRouter();
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [answersByQuestion, setAnswersByQuestion] = useState<AnswersByQuestion>({});
    const stepHeadingRef = useRef<HTMLHeadingElement>(null);
    const previousStepIndex = useRef(activeStepIndex);
    const activeQuestion = module.questions[activeStepIndex];
    const isLastStep = activeStepIndex === module.questions.length - 1;

    useEffect(() => {
        if (previousStepIndex.current !== activeStepIndex) {
            stepHeadingRef.current?.focus();
            previousStepIndex.current = activeStepIndex;
        }
    }, [activeStepIndex]);

    if (!activeQuestion) {
        return null;
    }

    function updateAnswers(questionId: string, answerIds: readonly string[]) {
        setAnswersByQuestion((current) => ({
            ...current,
            [questionId]: answerIds,
        }));
    }

    function goToResults(answerIds: readonly string[]) {
        router.push(buildResultHref({ answerIds }));
    }

    function completeOnboarding() {
        const answerIds = module.questions.flatMap((question) => answersByQuestion[question.id] ?? []);
        goToResults(answerIds);
    }

    return (
        <VStack gap={{ xs: "space-24", md: "space-40" }}>
            <VStack gap="space-12">
                <Heading level="1" size="xlarge">
                    {module.title}
                </Heading>
                <BodyLong size="large">{module.intro}</BodyLong>
            </VStack>

            <FormProgress
                totalSteps={module.questions.length}
                activeStep={activeStepIndex + 1}
                interactiveSteps={false}
            >
                {module.questions.map((question, index) => (
                    <FormProgress.Step key={question.id} completed={index < activeStepIndex}>
                        {question.title}
                    </FormProgress.Step>
                ))}
            </FormProgress>

            <Box as="section">
                <VStack gap="space-24">
                    <Heading ref={stepHeadingRef} tabIndex={-1} level="2" size="large">
                        {activeQuestion.title}
                    </Heading>
                    <QuestionField
                        question={activeQuestion}
                        selectedAnswerIds={answersByQuestion[activeQuestion.id] ?? []}
                        onChange={(answerIds) => updateAnswers(activeQuestion.id, answerIds)}
                    />
                </VStack>
            </Box>

            <VStack gap="space-16">
                <HStack gap="space-16" wrap>
                    {activeStepIndex > 0 && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setActiveStepIndex((current) => current - 1)}
                        >
                            Tilbake
                        </Button>
                    )}
                    {isLastStep ? (
                        <Button type="button" onClick={completeOnboarding}>
                            Fullfør
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={() =>
                                setActiveStepIndex((current) => Math.min(current + 1, module.questions.length - 1))
                            }
                        >
                            Neste
                        </Button>
                    )}
                </HStack>
                <div>
                    <Button type="button" variant="tertiary" onClick={() => goToResults([])}>
                        Hopp over
                    </Button>
                </div>
            </VStack>
        </VStack>
    );
}

type QuestionFieldProps = Readonly<{
    question: OnboardingQuestion;
    selectedAnswerIds: readonly string[];
    onChange: (answerIds: readonly string[]) => void;
}>;

function QuestionField({ question, selectedAnswerIds, onChange }: QuestionFieldProps) {
    if (question.selectionMode === "single") {
        return (
            <RadioGroup
                legend={question.title}
                hideLegend
                description={question.description}
                value={selectedAnswerIds[0] ?? ""}
                onChange={(answerId: string) => onChange([answerId])}
            >
                {question.options.map((option) => (
                    <Radio key={option.id} value={option.id} description={option.description}>
                        {option.label}
                    </Radio>
                ))}
            </RadioGroup>
        );
    }

    return (
        <CheckboxGroup
            legend={question.title}
            hideLegend
            description={question.description}
            value={[...selectedAnswerIds]}
            onChange={(answerIds: string[]) => onChange(answerIds)}
        >
            {question.options.map((option) => (
                <Checkbox key={option.id} value={option.id} description={option.description}>
                    {option.label}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
