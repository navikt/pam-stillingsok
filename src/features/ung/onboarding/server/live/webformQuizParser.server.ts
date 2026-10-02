import "server-only";
import { parse } from "yaml";
import { z } from "zod";
import type { ArticleQuiz } from "@/features/ung/onboarding/domain/types";
import { runMapping, SharedContentMappingError } from "@/features/ung/onboarding/server/jsonApiMapping";
import type { WebformDocument } from "@/features/ung/onboarding/server/jsonApiTypes";
import { sanitizeSharedContentHtml } from "@/features/ung/onboarding/server/sanitizeSharedContentHtml.server";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";

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

export function parseWebformQuiz(document: WebformDocument): SharedContentResult<ArticleQuiz> {
    return runMapping(() => {
        if (document.yaml.length > MAX_WEBFORM_YAML_LENGTH) {
            throw new SharedContentMappingError("Webform-quizen er for stor");
        }

        const elements = elementsSchema.safeParse(parseYaml(document.yaml));
        if (!elements.success) {
            throw new SharedContentMappingError("Webform-quizen har en uventet struktur");
        }

        const questions = Object.entries(elements.data).flatMap(([questionId, element]) => {
            if (typeof element["#type"] === "string" && IGNORED_ELEMENT_TYPES.has(element["#type"])) {
                return [];
            }
            return [mapQuestion(questionId, element)];
        });

        if (questions.length === 0) {
            throw new SharedContentMappingError("Webform-quizen har ingen spørsmål");
        }
        if (questions.length > MAX_QUIZ_QUESTIONS) {
            throw new SharedContentMappingError("Webform-quizen har for mange spørsmål");
        }
        return { questions };
    });
}

function parseYaml(yaml: string): unknown {
    try {
        // Kjerneschema uten egendefinerte tags, og aliaser er slått av.
        return parse(yaml, { schema: "core", maxAliasCount: 0, uniqueKeys: true });
    } catch {
        throw new SharedContentMappingError("Webform-quizen har ugyldig YAML");
    }
}

function mapQuestion(questionId: string, element: Record<string, unknown>) {
    const parsed = quizElementSchema.safeParse(element);
    if (!parsed.success) {
        throw new SharedContentMappingError("Webform-quizen har et element som ikke støttes");
    }

    const optionEntries = Object.entries(parsed.data["#options"]);
    if (optionEntries.length < 2) {
        throw new SharedContentMappingError("Quizspørsmål må ha minst to alternativer");
    }
    if (optionEntries.length > MAX_QUIZ_OPTIONS) {
        throw new SharedContentMappingError("Quizspørsmål har for mange alternativer");
    }

    const quizOptions = parsed.data["#quiz__options"];
    if (Object.keys(quizOptions).some((key) => !(key in parsed.data["#options"]))) {
        throw new SharedContentMappingError("Quizfasit refererer til ukjente alternativer");
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
        throw new SharedContentMappingError("Quizspørsmål kan ikke ha mer enn ett riktig svar");
    }

    return { id: questionId, statement: parsed.data["#title"], options };
}
