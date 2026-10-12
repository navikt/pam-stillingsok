"use client";

import { BodyShort, Box, Checkbox, CheckboxGroup, ExpansionCard, HGrid, Select, VStack } from "@navikt/ds-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
    type OnboardingModule,
    type OnboardingQuestion,
    onboardingQuestions,
    type Selection,
} from "@/features/ung/onboarding/domain/onboarding";
import { encodeSelectionParams } from "@/features/ung/onboarding/domain/selectionParams";

type ResultFiltersProps = Readonly<{
    module: OnboardingModule;
    selection: Selection;
}>;

export function ResultFilters({ module, selection }: ResultFiltersProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [hasRequestedUpdate, setHasRequestedUpdate] = useState(false);
    const [draftSelection, setDraftSelection] = useState<Selection>(selection);
    const draftSelectionRef = useRef<Selection>(selection);
    const questions = onboardingQuestions(module);
    const singleQuestions = questions.filter((question) => !question.multiple);
    const multipleQuestions = questions.filter((question) => question.multiple);

    useEffect(() => {
        draftSelectionRef.current = selection;
        setDraftSelection(selection);
    }, [selection]);

    function updateResults(nextSelection: Selection) {
        const searchParams = encodeSelectionParams(nextSelection, module);

        setHasRequestedUpdate(true);
        startTransition(() => {
            router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
        });
    }

    function updateQuestionAnswers(question: OnboardingQuestion, optionIds: readonly string[]) {
        const nextSelection: Selection = {
            ...draftSelectionRef.current,
            [question.id]: { dimension: question.dimension, optionIds },
        };

        draftSelectionRef.current = nextSelection;
        setDraftSelection(nextSelection);
        updateResults(nextSelection);
    }

    return (
        <Box
            as="section"
            background="brand-blue-soft"
            borderRadius="12"
            padding={{ xs: "space-16", md: "space-24" }}
            aria-label="Tilpass innholdet"
        >
            <VStack gap="space-16">
                <HGrid columns={{ xs: 1, md: 2 }} gap="space-16">
                    {singleQuestions.map((question) => (
                        <Select
                            key={question.id}
                            name={question.id}
                            label={question.title}
                            value={draftSelection[question.id]?.optionIds[0] ?? question.options[0]?.id ?? ""}
                            onChange={(event) =>
                                updateQuestionAnswers(question, event.target.value ? [event.target.value] : [])
                            }
                        >
                            {question.options.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    ))}
                </HGrid>

                {multipleQuestions.map((question) => {
                    const selectedOptionIds = new Set(draftSelection[question.id]?.optionIds ?? []);
                    const selectedOptions = question.options.filter((option) => selectedOptionIds.has(option.id));
                    const summary =
                        selectedOptions.length === 0
                            ? "Ingen valgt"
                            : selectedOptions.map((option) => option.label).join(", ");

                    return (
                        <ExpansionCard key={question.id} size="small" data-color="info" aria-label={question.title}>
                            <ExpansionCard.Header>
                                <ExpansionCard.Title as="h2" size="small">
                                    {question.title}: {summary}
                                </ExpansionCard.Title>
                            </ExpansionCard.Header>
                            <ExpansionCard.Content>
                                <CheckboxGroup
                                    legend={question.title}
                                    hideLegend
                                    value={selectedOptions.map((option) => option.id)}
                                    onChange={(optionIds) => updateQuestionAnswers(question, optionIds)}
                                >
                                    {question.options.map((option) => (
                                        <Checkbox key={option.id} name={question.id} value={option.id}>
                                            {option.label}
                                        </Checkbox>
                                    ))}
                                </CheckboxGroup>
                            </ExpansionCard.Content>
                        </ExpansionCard>
                    );
                })}

                <BodyShort as="span" visuallyHidden role="status" aria-live="polite" aria-atomic="true">
                    {hasRequestedUpdate ? (isPending ? "Oppdaterer innhold" : "Innholdet er oppdatert") : ""}
                </BodyShort>
            </VStack>
        </Box>
    );
}
