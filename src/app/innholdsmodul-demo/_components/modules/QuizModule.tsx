"use client";

import { Alert, BodyShort, Box, Button, Heading, Radio, RadioGroup, Tag, VStack } from "@navikt/ds-react";
import { useState } from "react";
import type { QuizParagraph } from "@/app/innholdsmodul-demo/_data/speculativeTypes";

type Props = {
    paragraph: QuizParagraph;
};

export default function QuizModule({ paragraph }: Props) {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);

    const correctCount = submitted ? paragraph.questions.filter((q, i) => answers[i] === q.correctIndex).length : 0;

    return (
        <VStack gap="space-6">
            <Tag variant="error" size="xsmall" style={{ alignSelf: "flex-start" }}>
                SPEKULATIBV — QuizModule
            </Tag>
            <Heading size="medium" level="2">
                {paragraph.title}
            </Heading>
            {paragraph.questions.map((q, qi) => {
                const isCorrect = submitted && answers[qi] === q.correctIndex;
                const isWrong = submitted && answers[qi] !== undefined && answers[qi] !== q.correctIndex;
                return (
                    <Box
                        key={q.question}
                        style={{
                            backgroundColor: submitted
                                ? isCorrect
                                    ? "var(--a-surface-success-subtle)"
                                    : isWrong
                                      ? "var(--a-surface-danger-subtle)"
                                      : undefined
                                : undefined,
                            border: "1px solid var(--a-border-subtle)",
                            borderRadius: "var(--a-border-radius-medium)",
                        }}
                        padding="space-6"
                    >
                        <VStack gap="space-4">
                            <RadioGroup
                                legend={q.question}
                                value={answers[qi] ?? null}
                                onChange={(val) => {
                                    if (!submitted) {
                                        setAnswers((prev) => ({ ...prev, [qi]: val as number }));
                                    }
                                }}
                            >
                                {q.options.map((opt, oi) => (
                                    <Radio key={opt} value={oi}>
                                        {opt}
                                    </Radio>
                                ))}
                            </RadioGroup>
                            {submitted && q.explanation && <BodyShort size="small">{q.explanation}</BodyShort>}
                        </VStack>
                    </Box>
                );
            })}
            {!submitted ? (
                <Button
                    variant="primary"
                    onClick={() => setSubmitted(true)}
                    disabled={Object.keys(answers).length < paragraph.questions.length}
                >
                    Sjekk svarene
                </Button>
            ) : (
                <Alert variant={correctCount === paragraph.questions.length ? "success" : "info"}>
                    {correctCount} av {paragraph.questions.length} riktige
                </Alert>
            )}
        </VStack>
    );
}
