import { BodyLong, Heading, Textarea } from "@navikt/ds-react";
import type { PublishedQuestion } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/Application";
import { QUESTION_ANSWER_MAX_LENGTH } from "./validateForm";

interface ScreeningQuestionsProps {
    questions: PublishedQuestion[];
    questionAnswerErrors?: Record<string, string>;
    onAnswerChange: (questionId: string) => void;
}

function ScreeningQuestions({ questions, questionAnswerErrors, onAnswerChange }: ScreeningQuestionsProps) {
    const sorted = [...questions].sort((a, b) => a.sortOrder - b.sortOrder);

    return (
        <section className="mb-10">
            <Heading level="2" size="medium" spacing>
                Spørsmål fra arbeidsgiver
            </Heading>
            <BodyLong className="mb-8">Svar på spørsmålene under for å søke på stillingen.</BodyLong>
            {sorted.map((question) => (
                <Textarea
                    key={question.id}
                    id={`new-application-screening-${question.id}`}
                    name={`screening-${question.id}`}
                    label={question.label}
                    maxLength={QUESTION_ANSWER_MAX_LENGTH}
                    error={questionAnswerErrors?.[question.id]}
                    onChange={() => onAnswerChange(question.id)}
                    className="mb-6"
                />
            ))}
        </section>
    );
}

export default ScreeningQuestions;
