import { BodyShort, Box, Heading, HStack, Tag, VStack } from "@navikt/ds-react";
import { useId } from "react";
import type {
    ArticleQuizQuestion,
    ArticleQuizSection,
    ArticleQuizTheme,
} from "@/features/ung/enklere-vei-til-jobb/domain/article";
import styles from "./ArticleQuiz.module.css";
import { type AnswersByQuestion, countCorrectAnswers, isGradedQuestion } from "./articleQuizUtils";
import { QuizQuestion } from "./QuizQuestion";

type QuizSectionStyle = Readonly<{
    className?: string;
    color: "brand-magenta" | "brand-beige" | "success" | "meta-purple" | "neutral";
}>;

const DEFAULT_SECTION_STYLE = { className: undefined, color: "neutral" } as const;

const SECTION_STYLES = {
    rose: { className: styles.rose, color: "brand-magenta" },
    peach: { className: styles.peach, color: "brand-beige" },
    mint: { className: styles.mint, color: "success" },
    lavender: { className: styles.lavender, color: "meta-purple" },
} as const satisfies Readonly<Record<ArticleQuizTheme, QuizSectionStyle>>;

type QuizSectionProps = Readonly<{
    section: ArticleQuizSection;
    fallbackTitle: string;
    answersByQuestion: AnswersByQuestion;
    onAnswer: (question: ArticleQuizQuestion, optionId: string) => void;
}>;

export function QuizSection({ section, fallbackTitle, answersByQuestion, onAnswer }: QuizSectionProps) {
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
                        onAnswer={(optionId: string) => onAnswer(question, optionId)}
                    />
                ))}
            </VStack>
        </Box>
    );
}
