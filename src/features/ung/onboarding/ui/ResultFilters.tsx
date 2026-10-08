"use client";

import { BodyShort, Box, Checkbox, CheckboxGroup, ExpansionCard, HGrid, Select, VStack } from "@navikt/ds-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { OnboardingModule, OnboardingQuestion, Selection } from "@/features/ung/onboarding/domain/onboarding";
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
    const [draftAnswerIds, setDraftAnswerIds] = useState<readonly string[]>(selection.answerIds);
    const draftAnswerIdsRef = useRef<readonly string[]>(selection.answerIds);
    const selectedAnswerIds = new Set(draftAnswerIds);
    const singleQuestions = module.questions.filter((question) => question.selectionMode === "single");
    const multipleQuestions = module.questions.filter((question) => question.selectionMode === "multiple");

    useEffect(() => {
        draftAnswerIdsRef.current = selection.answerIds;
        setDraftAnswerIds(selection.answerIds);
    }, [selection.answerIds]);

    function updateResults(answerIds: readonly string[]) {
        const searchParams = encodeSelectionParams({ answerIds });

        setHasRequestedUpdate(true);
        startTransition(() => {
            router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
        });
    }

    function updateQuestionAnswers(question: OnboardingQuestion, answerIds: readonly string[]) {
        const optionIds = new Set(question.options.map((option) => option.id));
        const nextAnswerIds = [
            ...draftAnswerIdsRef.current.filter((answerId) => !optionIds.has(answerId)),
            ...answerIds,
        ];

        draftAnswerIdsRef.current = nextAnswerIds;
        setDraftAnswerIds(nextAnswerIds);
        updateResults(nextAnswerIds);
    }

    console.log("dafds", singleQuestions);
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
                            name="svar"
                            label={question.title}
                            value={
                                question.options.find((option) => selectedAnswerIds.has(option.id))?.id ??
                                question.options[0]?.id ??
                                ""
                            }
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
                    const selectedOptions = question.options.filter((option) => selectedAnswerIds.has(option.id));
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
                                    onChange={(answerIds) => updateQuestionAnswers(question, answerIds)}
                                >
                                    {question.options.map((option) => (
                                        <Checkbox key={option.id} name="svar" value={option.id}>
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
