import "server-only";
import { parse } from "yaml";
import { z } from "zod";
import type { ArticleQuiz } from "@/features/ung/onboarding/domain/types";
import type { WebformDocument } from "@/features/ung/onboarding/server/jsonApiTypes";
import type { LiveAdapterResult } from "@/features/ung/onboarding/server/live/liveSharedContentAdapter";
import { sanitizeSharedContentHtml } from "@/features/ung/onboarding/server/sanitizeSharedContentHtml.server";

export const MAX_WEBFORM_YAML_LENGTH = 50_000;
export const MAX_QUIZ_QUESTIONS = 20;
export const MAX_QUIZ_OPTIONS = 8;
const MAX_ID_LENGTH = 128;
const MAX_STATEMENT_LENGTH = 500;
const MAX_LABEL_LENGTH = 300;
const MAX_FEEDBACK_LENGTH = 2_000;

// Skjemahandlinger (send-knapp) rendres ikke av quizen og ignoreres.
const IGNORED_ELEMENT_TYPES = new Set(["webform_actions"]);

const elementIdSchema = z
    .string()
    .min(1)
    .max(MAX_ID_LENGTH)
    .regex(/^[^\p{Cc}]+$/u);

const quizElementSchema = z.object({
    "#type": z.literal("quiz_element_radios"),
    "#title": z.string().min(1).max(MAX_STATEMENT_LENGTH),
    "#options": z.record(elementIdSchema, z.string().min(1).max(MAX_LABEL_LENGTH)),
    "#quiz__options": z.record(
        elementIdSchema,
        z.object({
            is_correct: z.boolean().optional(),
            feedback: z.string().max(MAX_FEEDBACK_LENGTH).optional(),
        }),
    ),
});

const elementsSchema = z.record(elementIdSchema, z.record(z.string(), z.unknown()));

class QuizContractError extends Error {}

function invalid(message: string): LiveAdapterResult<never> {
    return { ok: false, error: { type: "invalid-contract", message, issuePaths: [] } };
}

export function parseWebformQuiz(document: WebformDocument): LiveAdapterResult<ArticleQuiz> {
    if (document.yaml.length > MAX_WEBFORM_YAML_LENGTH) {
        return invalid("Webform-quizen er for stor");
    }

    let parsedYaml: unknown;
    try {
        // Kjerneschema uten egendefinerte tags, og aliaser er slått av.
        parsedYaml = parse(document.yaml, { schema: "core", maxAliasCount: 0, uniqueKeys: true });
    } catch {
        return invalid("Webform-quizen har ugyldig YAML");
    }

    const elements = elementsSchema.safeParse(parsedYaml);
    if (!elements.success) {
        return invalid("Webform-quizen har en uventet struktur");
    }

    try {
        const questions = Object.entries(elements.data).flatMap(([questionId, element]) => {
            if (typeof element["#type"] === "string" && IGNORED_ELEMENT_TYPES.has(element["#type"])) {
                return [];
            }
            return [mapQuestion(questionId, element)];
        });

        if (questions.length === 0) {
            throw new QuizContractError("Webform-quizen har ingen spørsmål");
        }
        if (questions.length > MAX_QUIZ_QUESTIONS) {
            throw new QuizContractError("Webform-quizen har for mange spørsmål");
        }
        return { ok: true, data: { questions } };
    } catch (error) {
        if (error instanceof QuizContractError) {
            return invalid(error.message);
        }
        throw error;
    }
}

function mapQuestion(questionId: string, element: Record<string, unknown>) {
    const parsed = quizElementSchema.safeParse(element);
    if (!parsed.success) {
        throw new QuizContractError("Webform-quizen har et element som ikke støttes");
    }

    const optionEntries = Object.entries(parsed.data["#options"]);
    if (optionEntries.length < 2) {
        throw new QuizContractError("Quizspørsmål må ha minst to alternativer");
    }
    if (optionEntries.length > MAX_QUIZ_OPTIONS) {
        throw new QuizContractError("Quizspørsmål har for mange alternativer");
    }

    const quizOptions = parsed.data["#quiz__options"];
    if (Object.keys(quizOptions).some((key) => !(key in parsed.data["#options"]))) {
        throw new QuizContractError("Quizfasit refererer til ukjente alternativer");
    }

    const options = optionEntries.map(([optionId, label]) => ({
        id: optionId,
        label,
        isCorrect: quizOptions[optionId]?.is_correct === true,
        feedbackHtml: sanitizeSharedContentHtml(quizOptions[optionId]?.feedback ?? ""),
    }));
    // Noen quizer er selvevaluering uten fasit (ingen alternativ er is_correct: true).
    // Da vises bare feedback nøytralt. Mer enn ett riktig svar er fortsatt en ugyldig kontrakt.
    if (options.filter((option) => option.isCorrect).length > 1) {
        throw new QuizContractError("Quizspørsmål kan ikke ha mer enn ett riktig svar");
    }

    return { id: questionId, statement: parsed.data["#title"], options };
}
