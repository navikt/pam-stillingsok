import { Box, HStack, Radio, RadioGroup, Stack, Tag, VStack } from "@navikt/ds-react";
import type { ArticleQuizQuestion } from "@/features/ung/enklere-vei-til-jobb/domain/article";
import { SafeHtml } from "@/features/ung/enklere-vei-til-jobb/ui/SafeHtml";
import { isGradedQuestion } from "./articleQuizUtils";

type QuizQuestionProps = Readonly<{
    question: ArticleQuizQuestion;
    sectionTitle: string;
    sectionColor: "brand-magenta" | "brand-beige" | "success" | "meta-purple" | "neutral";
    selectedOptionId?: string;
    onAnswer: (optionId: string) => void;
}>;

export function QuizQuestion({ question, sectionTitle, sectionColor, selectedOptionId, onAnswer }: QuizQuestionProps) {
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
