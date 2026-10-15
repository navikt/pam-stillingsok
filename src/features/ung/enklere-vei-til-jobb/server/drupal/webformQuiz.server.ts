import "server-only";
import { z } from "zod";
import type {
    ArticleQuiz,
    ArticleQuizSection,
    ArticleQuizTheme,
} from "@/features/ung/enklere-vei-til-jobb/domain/article";
import { runMapping, SharedContentMappingError } from "@/features/ung/enklere-vei-til-jobb/server/drupal/jsonApi";
import { parseWebformYamlSafely } from "@/features/ung/enklere-vei-til-jobb/server/drupal/webformYamlParser.server";
import { sanitizeSharedContentHtml } from "@/features/ung/enklere-vei-til-jobb/server/sanitizeSharedContentHtml.server";
import type { SharedContentResult } from "@/features/ung/enklere-vei-til-jobb/server/sharedContentResult";

export const MAX_WEBFORM_YAML_LENGTH = 50_000;
export const MAX_QUIZ_SECTIONS = 20;
export const MAX_QUIZ_QUESTIONS = 20;
export const MAX_QUIZ_OPTIONS = 8;
const MAX_ID_LENGTH = 128;
const MAX_STATEMENT_LENGTH = 500;
const MAX_LABEL_LENGTH = 300;
const MAX_FEEDBACK_LENGTH = 2_000;
const MAX_ATTRIBUTE_CLASSES = 20;
const MAX_ATTRIBUTE_CLASS_LENGTH = 128;
const UNGROUPED_SECTION_ID = "ungrouped";

// Skjemahandlinger (send-knapp) rendres ikke av quizen og ignoreres.
const IGNORED_ELEMENT_TYPES = new Set(["webform_actions"]);
const THEME_BY_CLASS = {
    "content-group--rose": "rose",
    "content-group--peach": "peach",
    "content-group--mint": "mint",
    "content-group--lavender": "lavender",
} as const satisfies Readonly<Record<string, ArticleQuizTheme>>;

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

const fieldsetElementSchema = z.object({
    "#type": z.literal("fieldset"),
    "#title": z.string().min(1).max(MAX_STATEMENT_LENGTH),
    "#attributes": z
        .object({
            class: z.array(z.string().min(1).max(MAX_ATTRIBUTE_CLASS_LENGTH)).max(MAX_ATTRIBUTE_CLASSES),
        })
        .optional(),
});

const elementSchema = z.record(z.string(), z.unknown());
const elementsSchema = z.record(elementIdSchema, elementSchema);

export function parseWebformQuiz(yaml: string): SharedContentResult<ArticleQuiz> {
    return runMapping(() => {
        const elements = elementsSchema.safeParse(
            parseWebformYamlSafely(yaml, MAX_WEBFORM_YAML_LENGTH, "Webform-quizen er for stor eller har ugyldig YAML"),
        );
        if (!elements.success) {
            throw new SharedContentMappingError("Webform-quizen har en uventet struktur");
        }

        const visibleElements = Object.entries(elements.data).filter(
            ([, element]) => typeof element["#type"] !== "string" || !IGNORED_ELEMENT_TYPES.has(element["#type"]),
        );

        if (visibleElements.length === 0) {
            throw new SharedContentMappingError("Webform-quizen har ingen spørsmål");
        }

        const sections = mapSections(visibleElements);
        const questionIds = sections.flatMap((section) => section.questions.map((question) => question.id));
        const questionCount = questionIds.length;
        if (questionCount === 0) {
            throw new SharedContentMappingError("Webform-quizen har ingen spørsmål");
        }
        if (questionCount > MAX_QUIZ_QUESTIONS) {
            throw new SharedContentMappingError("Webform-quizen har for mange spørsmål");
        }
        if (new Set(questionIds).size !== questionCount) {
            throw new SharedContentMappingError("Quizspørsmål må ha unike ID-er");
        }
        return { sections };
    });
}

function mapSections(elements: readonly (readonly [string, Record<string, unknown>])[]): readonly ArticleQuizSection[] {
    if (elements.every(([, element]) => element["#type"] === "quiz_element_radios")) {
        return [
            {
                id: UNGROUPED_SECTION_ID,
                questions: elements.map(([questionId, element]) => mapQuestion(questionId, element)),
            },
        ];
    }

    if (!elements.every(([, element]) => element["#type"] === "fieldset")) {
        throw new SharedContentMappingError("Webform-quizen blander grupperte og ugrupperte spørsmål");
    }
    if (elements.length > MAX_QUIZ_SECTIONS) {
        throw new SharedContentMappingError("Webform-quizen har for mange seksjoner");
    }

    return elements.map(([sectionId, element]) => mapSection(sectionId, element));
}

function mapSection(sectionId: string, element: Record<string, unknown>): ArticleQuizSection {
    const parsed = fieldsetElementSchema.safeParse(element);
    if (!parsed.success) {
        throw new SharedContentMappingError("Webform-quizen har en ugyldig seksjon");
    }

    const questionEntries = Object.entries(element).filter(([key]) => !key.startsWith("#"));
    if (questionEntries.length === 0) {
        throw new SharedContentMappingError("Quizseksjoner må ha minst ett spørsmål");
    }

    const theme = mapTheme(parsed.data["#attributes"]?.class ?? []);
    return {
        id: sectionId,
        title: parsed.data["#title"],
        ...(theme === undefined ? {} : { theme }),
        questions: questionEntries.map(([questionId, question]) => {
            const parsedQuestion = elementSchema.safeParse(question);
            if (!parsedQuestion.success) {
                throw new SharedContentMappingError("Quizseksjonen har et ugyldig spørsmål");
            }
            return mapQuestion(questionId, parsedQuestion.data);
        }),
    };
}

function mapTheme(classes: readonly string[]): ArticleQuizTheme | undefined {
    const themes = [
        ...new Set(
            classes
                .map((className) =>
                    Object.hasOwn(THEME_BY_CLASS, className)
                        ? THEME_BY_CLASS[className as keyof typeof THEME_BY_CLASS]
                        : undefined,
                )
                .filter((theme): theme is ArticleQuizTheme => theme !== undefined),
        ),
    ];
    if (themes.length === 0) {
        return undefined;
    }
    if (themes.length > 1) {
        throw new SharedContentMappingError("Quizseksjonen har flere fargetema");
    }

    return themes[0];
}

function mapQuestion(questionId: string, element: Record<string, unknown>) {
    if (!elementIdSchema.safeParse(questionId).success) {
        throw new SharedContentMappingError("Quizspørsmålet har en ugyldig ID");
    }

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
    if (options.filter((option) => option.isCorrect).length > 1) {
        throw new SharedContentMappingError("Quizspørsmål kan ikke ha mer enn ett riktig svar");
    }

    return { id: questionId, statement: parsed.data["#title"], options };
}
