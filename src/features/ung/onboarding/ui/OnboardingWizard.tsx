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
import { type Ref, useEffect, useRef, useState } from "react";
import {
    defaultSelection,
    type OnboardingModule,
    type OnboardingQuestion,
    type Selection,
} from "@/features/ung/onboarding/domain/onboarding";
import { buildResultHref } from "@/features/ung/onboarding/domain/selectionParams";

type OnboardingWizardProps = Readonly<{
    module: OnboardingModule;
}>;

type AnswersByQuestion = Record<string, readonly string[]>;

function toInitialAnswers(module: OnboardingModule): AnswersByQuestion {
    const defaults = defaultSelection(module);
    const answers: AnswersByQuestion = {};
    for (const step of module.steps) {
        for (const question of step.questions) {
            answers[question.id] = defaults[question.id]?.optionIds ?? [];
        }
    }
    return answers;
}

function toSelection(module: OnboardingModule, answersByQuestion: AnswersByQuestion): Selection {
    const selection: Record<string, Selection[string]> = {};
    for (const step of module.steps) {
        for (const question of step.questions) {
            selection[question.id] = {
                dimension: question.dimension,
                optionIds: answersByQuestion[question.id] ?? [],
            };
        }
    }
    return selection;
}

export function OnboardingWizard({ module }: OnboardingWizardProps) {
    const router = useRouter();
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [answersByQuestion, setAnswersByQuestion] = useState<AnswersByQuestion>(() => toInitialAnswers(module));
    const [invalidQuestionIds, setInvalidQuestionIds] = useState<ReadonlySet<string>>(new Set());
    const stepHeadingRef = useRef<HTMLHeadingElement>(null);
    const questionRefs = useRef<Map<string, HTMLFieldSetElement | null>>(new Map());
    const previousStepIndex = useRef(activeStepIndex);
    const activeStep = module.steps[activeStepIndex];
    const isLastStep = activeStepIndex === module.steps.length - 1;

    useEffect(() => {
        if (previousStepIndex.current !== activeStepIndex) {
            stepHeadingRef.current?.focus();
            previousStepIndex.current = activeStepIndex;
        }
    }, [activeStepIndex]);

    if (!activeStep) {
        return null;
    }

    function updateAnswers(questionId: string, optionIds: readonly string[]) {
        setAnswersByQuestion((current) => ({
            ...current,
            [questionId]: optionIds,
        }));
        setInvalidQuestionIds((current) => {
            if (!current.has(questionId)) {
                return current;
            }
            const next = new Set(current);
            next.delete(questionId);
            return next;
        });
    }

    function goToResults(selection: Selection) {
        router.push(buildResultHref(selection, module));
    }

    /** Validerer påkrevde spørsmål i det aktive steget. Returnerer false og flytter fokus til
     * første feil hvis et påkrevd flervalgsspørsmål mangler svar. Enkeltvalg er allerede utfylt
     * gjennom standardvalget, så bare flervalg kan feile her. */
    function validateActiveStep(): boolean {
        const invalidInStep = activeStep.questions.filter(
            (question) => question.required && question.multiple && (answersByQuestion[question.id]?.length ?? 0) === 0,
        );
        if (invalidInStep.length === 0) {
            return true;
        }
        setInvalidQuestionIds(new Set(invalidInStep.map((question) => question.id)));
        questionRefs.current.get(invalidInStep[0]?.id)?.querySelector("input")?.focus();
        return false;
    }

    function goToNextStep() {
        if (!validateActiveStep()) {
            return;
        }
        setActiveStepIndex((current) => Math.min(current + 1, module.steps.length - 1));
    }

    function completeOnboarding() {
        if (!validateActiveStep()) {
            return;
        }
        goToResults(toSelection(module, answersByQuestion));
    }

    function skipOnboarding() {
        goToResults(defaultSelection(module));
    }

    return (
        <VStack gap={{ xs: "space-24", md: "space-40" }}>
            <VStack gap="space-12">
                <Heading level="1" size="xlarge">
                    {module.title}
                </Heading>
                <BodyLong size="large">{module.intro}</BodyLong>
            </VStack>

            <FormProgress totalSteps={module.steps.length} activeStep={activeStepIndex + 1} interactiveSteps={false}>
                {module.steps.map((step, index) => (
                    <FormProgress.Step key={step.id} completed={index < activeStepIndex}>
                        {step.title}
                    </FormProgress.Step>
                ))}
            </FormProgress>

            <Box as="section">
                <VStack gap="space-24">
                    <Heading ref={stepHeadingRef} tabIndex={-1} level="2" size="large">
                        {activeStep.title}
                    </Heading>
                    {activeStep.questions.map((question) => (
                        <QuestionField
                            key={question.id}
                            ref={(element) => {
                                questionRefs.current.set(question.id, element);
                            }}
                            question={question}
                            selectedOptionIds={answersByQuestion[question.id] ?? []}
                            isInvalid={invalidQuestionIds.has(question.id)}
                            onChange={(optionIds) => updateAnswers(question.id, optionIds)}
                        />
                    ))}
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
                        <Button type="button" onClick={goToNextStep}>
                            Neste
                        </Button>
                    )}
                </HStack>
                <div>
                    <Button type="button" variant="tertiary" onClick={skipOnboarding}>
                        Hopp over
                    </Button>
                </div>
            </VStack>
        </VStack>
    );
}

type QuestionFieldProps = Readonly<{
    question: OnboardingQuestion;
    selectedOptionIds: readonly string[];
    isInvalid: boolean;
    onChange: (optionIds: readonly string[]) => void;
    ref: Ref<HTMLFieldSetElement>;
}>;

function QuestionField({ question, selectedOptionIds, isInvalid, onChange, ref }: QuestionFieldProps) {
    const error = isInvalid ? "Velg minst ett alternativ" : undefined;

    if (question.controlType === "radios") {
        return (
            <RadioGroup
                legend={question.title}
                description={question.description}
                value={selectedOptionIds[0] ?? ""}
                onChange={(optionId: string) => onChange([optionId])}
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
            ref={ref}
            legend={question.title}
            description={question.description}
            error={error}
            value={[...selectedOptionIds]}
            onChange={(optionIds: string[]) => onChange(optionIds)}
        >
            {question.options.map((option) => (
                <Checkbox key={option.id} value={option.id} description={option.description}>
                    {option.label}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
