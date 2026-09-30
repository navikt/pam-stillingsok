import { z } from "zod";
import type {
    FaqAnswerBlock,
    JobQuiz,
    OnboardingModule,
    OnboardingResult,
    ResultContent,
    Selection,
} from "@/features/ung/onboarding/domain/types";
import type {
    JsonApiDocument,
    JsonApiResource,
    JsonApiResourceIdentifier,
} from "@/features/ung/onboarding/server/jsonApiTypes";
import { sanitizeSharedContentHtml } from "@/features/ung/onboarding/server/sanitizeSharedContentHtml.server";

const formattedTextSchema = z.object({
    value: z.string(),
    format: z.string(),
});

const moduleAttributesSchema = z.object({
    title: z.string().min(1),
    field_sc_intro: formattedTextSchema,
    field_result_title: z.string().min(1),
    field_result_intro: formattedTextSchema,
});

const questionAttributesSchema = z.object({
    field_question_title: z.string().min(1),
    field_question_description: z.string().optional(),
    field_selection_mode: z.enum(["single", "multiple"]),
});

const optionAttributesSchema = z.object({
    field_option_label: z.string().min(1),
    field_option_description: z.string().optional(),
});

const resultSectionAttributesSchema = z.object({
    field_section_title: z.string().min(1),
});

const articleAttributesSchema = z.object({
    title: z.string().min(1),
    field_sc_intro: formattedTextSchema,
    source_url: z.string().min(1),
    field_show_without_answers: z.boolean(),
});

const faqAttributesSchema = z.object({
    field_accordion_item_title: z.string().min(1),
    field_accordion_item_content: formattedTextSchema.optional(),
    field_show_without_answers: z.boolean(),
});

const contentUrlSchema = z.string().min(1).max(2048);

const jobQuizAttributesSchema = z.object({
    title: z.string().min(1),
    field_quiz_intro: formattedTextSchema,
});

const jobQuizSectionAttributesSchema = z.object({
    field_section_title: z.string().min(1),
});

const jobQuizQuestionAttributesSchema = z.object({
    field_question_statement: z.string().min(1),
    field_feedback_title: z.string().min(1),
    field_feedback_content: formattedTextSchema,
    field_read_more_label: z.string().min(1),
    source_url: contentUrlSchema,
});

const jobQuizOptionAttributesSchema = z.object({
    field_option_label: z.string().min(1),
    field_is_correct: z.boolean(),
});

const imageAttributesSchema = z.object({
    source_url: contentUrlSchema,
    alt: z.string(),
    width: z.number().int().positive().max(4096),
    height: z.number().int().positive().max(4096),
});

const answerHtmlAttributesSchema = z.object({
    rendered_html: z.string(),
});

const answerLinkAttributesSchema = z.object({
    field_label: z.string().min(1),
    source_url: contentUrlSchema,
});

const answerVideoCommonAttributesSchema = z.object({
    field_title: z.string().min(1),
    field_duration: z.string().min(1).optional(),
    field_thumbnail: imageAttributesSchema.optional(),
});

const answerVideoAttributesSchema = z.discriminatedUnion("field_video_provider", [
    answerVideoCommonAttributesSchema.extend({
        field_video_provider: z.literal("qbrick"),
        field_qbrick_media_id: z.uuid(),
    }),
    answerVideoCommonAttributesSchema.extend({
        field_video_provider: z.literal("vimeo"),
        source_url: contentUrlSchema,
    }),
]);

const answerRelatedCardAttributesSchema = z.object({
    field_title: z.string().min(1),
    field_description: z.string().min(1).optional(),
    field_source: z.string().min(1).optional(),
    source_url: contentUrlSchema,
});

export class SharedContentMappingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SharedContentMappingError";
    }
}

export function mapOnboardingModule(document: JsonApiDocument): OnboardingModule {
    if (document.data.type !== "node--shared_content_onboarding") {
        throw new SharedContentMappingError(`Uventet toppressurs: ${document.data.type}`);
    }

    const resources = buildResourceIndex(document);
    const attributes = parseAttributes(document.data, moduleAttributesSchema);
    const questions = getRelationshipIdentifiers(document.data, "field_questions").map((identifier) => {
        const questionResource = getResource(resources, identifier, "paragraph--onboarding_question");
        const questionAttributes = parseAttributes(questionResource, questionAttributesSchema);
        const options = getRelationshipIdentifiers(questionResource, "field_options").map((optionIdentifier) => {
            const optionResource = getResource(resources, optionIdentifier, "paragraph--onboarding_option");
            const optionAttributes = parseAttributes(optionResource, optionAttributesSchema);

            return {
                id: optionResource.id,
                label: optionAttributes.field_option_label,
                ...(optionAttributes.field_option_description
                    ? { description: optionAttributes.field_option_description }
                    : {}),
            };
        });
        if (options.length === 0) {
            throw new SharedContentMappingError(`Spørsmålet mangler svaralternativer: ${questionResource.id}`);
        }

        return {
            id: questionResource.id,
            title: questionAttributes.field_question_title,
            ...(questionAttributes.field_question_description
                ? { description: questionAttributes.field_question_description }
                : {}),
            selectionMode: questionAttributes.field_selection_mode,
            options,
        };
    });
    if (questions.length === 0) {
        throw new SharedContentMappingError("Onboarding-modulen mangler spørsmål");
    }

    const optionIds = questions.flatMap((question) => question.options.map((option) => option.id));
    if (new Set(optionIds).size !== optionIds.length) {
        throw new SharedContentMappingError("Alternativ-ID-er må være unike på tvers av spørsmål");
    }

    return {
        id: document.data.id,
        title: attributes.title,
        intro: attributes.field_sc_intro.value,
        resultTitle: attributes.field_result_title,
        resultIntro: attributes.field_result_intro.value,
        questions,
    };
}

export function mapOnboardingResult(document: JsonApiDocument, selection: Selection): OnboardingResult {
    if (document.data.type !== "node--shared_content_onboarding") {
        throw new SharedContentMappingError(`Uventet toppressurs: ${document.data.type}`);
    }

    const resources = buildResourceIndex(document);
    const moduleAttributes = parseAttributes(document.data, moduleAttributesSchema);
    const selectedAnswerIds = new Set(selection.answerIds);
    const mappedContentIds = new Set<string>();
    const sections = getRelationshipIdentifiers(document.data, "field_result_sections")
        .map((sectionIdentifier) => {
            const sectionResource = getResource(resources, sectionIdentifier, "paragraph--result_section");
            const sectionAttributes = parseAttributes(sectionResource, resultSectionAttributesSchema);
            const content = getRelationshipIdentifiers(sectionResource, "field_content")
                .map((contentIdentifier) => getResource(resources, contentIdentifier, contentIdentifier.type))
                .filter((resource) => shouldShowContent(resource, selectedAnswerIds))
                .filter((resource) => {
                    const key = resourceKey(resource);
                    if (mappedContentIds.has(key)) {
                        return false;
                    }
                    mappedContentIds.add(key);
                    return true;
                })
                .map((resource) => mapResultContent(resource, resources));

            return {
                id: sectionResource.id,
                title: sectionAttributes.field_section_title,
                content,
            };
        })
        .filter((section) => section.content.length > 0);

    return {
        title: moduleAttributes.field_result_title,
        intro: moduleAttributes.field_result_intro.value,
        sections,
    };
}

export function mapJobQuiz(document: JsonApiDocument): JobQuiz {
    if (document.data.type !== "node--shared_content_quiz") {
        throw new SharedContentMappingError(`Uventet toppressurs: ${document.data.type}`);
    }

    const resources = buildResourceIndex(document);
    const attributes = parseAttributes(document.data, jobQuizAttributesSchema);
    const sections = getRelationshipIdentifiers(document.data, "field_quiz_sections").map((sectionIdentifier) => {
        const sectionResource = getResource(resources, sectionIdentifier, "paragraph--quiz_section");
        const sectionAttributes = parseAttributes(sectionResource, jobQuizSectionAttributesSchema);
        const questions = getRelationshipIdentifiers(sectionResource, "field_quiz_questions").map(
            (questionIdentifier) => {
                const questionResource = getResource(resources, questionIdentifier, "paragraph--quiz_question");
                const questionAttributes = parseAttributes(questionResource, jobQuizQuestionAttributesSchema);
                const options = getRelationshipIdentifiers(questionResource, "field_quiz_options").map(
                    (optionIdentifier) => {
                        const optionResource = getResource(resources, optionIdentifier, "paragraph--quiz_option");
                        const optionAttributes = parseAttributes(optionResource, jobQuizOptionAttributesSchema);

                        return {
                            id: optionResource.id,
                            label: optionAttributes.field_option_label,
                            isCorrect: optionAttributes.field_is_correct,
                        };
                    },
                );
                if (options.length < 2) {
                    throw new SharedContentMappingError(
                        `Quizspørsmålet må ha minst to svaralternativer: ${questionResource.id}`,
                    );
                }
                if (options.filter((option) => option.isCorrect).length !== 1) {
                    throw new SharedContentMappingError(
                        `Quizspørsmålet må ha nøyaktig ett riktig svar: ${questionResource.id}`,
                    );
                }
                assertSafeContentHref(questionAttributes.source_url, "Quizlenken");

                return {
                    id: questionResource.id,
                    statement: questionAttributes.field_question_statement,
                    options,
                    feedback: {
                        title: questionAttributes.field_feedback_title,
                        html: sanitizeSharedContentHtml(questionAttributes.field_feedback_content.value),
                        href: questionAttributes.source_url,
                        linkLabel: questionAttributes.field_read_more_label,
                    },
                };
            },
        );
        if (questions.length === 0) {
            throw new SharedContentMappingError(`Quizseksjonen mangler spørsmål: ${sectionResource.id}`);
        }

        return {
            id: sectionResource.id,
            title: sectionAttributes.field_section_title,
            questions,
        };
    });
    if (sections.length === 0) {
        throw new SharedContentMappingError("Jobbquizen mangler seksjoner");
    }
    assertUniqueIds(sections, "Quizseksjons-ID-er");
    const questions = sections.flatMap((section) => section.questions);
    assertUniqueIds(questions, "Quizspørsmåls-ID-er");
    assertUniqueIds(
        questions.flatMap((question) => question.options),
        "Quizalternativ-ID-er",
    );

    return {
        id: document.data.id,
        title: attributes.title,
        intro: attributes.field_quiz_intro.value,
        sections,
    };
}

function assertUniqueIds(items: readonly Readonly<{ id: string }>[], label: string): void {
    const ids = items.map((item) => item.id);
    if (new Set(ids).size !== ids.length) {
        throw new SharedContentMappingError(`${label} må være unike`);
    }
}

function buildResourceIndex(document: JsonApiDocument): ReadonlyMap<string, JsonApiResource> {
    const resources = [document.data, ...document.included];
    const index = new Map<string, JsonApiResource>();

    for (const resource of resources) {
        const key = resourceKey(resource);
        if (index.has(key)) {
            throw new SharedContentMappingError(`Duplikatressurs: ${key}`);
        }
        index.set(key, resource);
    }

    return index;
}

function resourceKey(identifier: JsonApiResourceIdentifier): string {
    return `${identifier.type}:${identifier.id}`;
}

function getResource(
    resources: ReadonlyMap<string, JsonApiResource>,
    identifier: JsonApiResourceIdentifier,
    expectedType: string,
): JsonApiResource {
    if (identifier.type !== expectedType) {
        throw new SharedContentMappingError(`Uventet ressurstype: ${identifier.type}`);
    }

    const resource = resources.get(resourceKey(identifier));
    if (!resource) {
        throw new SharedContentMappingError(`Mangler relatert ressurs: ${resourceKey(identifier)}`);
    }
    return resource;
}

function getRelationshipIdentifiers(resource: JsonApiResource, relationshipName: string): JsonApiResourceIdentifier[] {
    const relationship = resource.relationships?.[relationshipName];
    if (!relationship || !Array.isArray(relationship.data)) {
        throw new SharedContentMappingError(`Mangler liste-relasjon: ${resource.type}.${relationshipName}`);
    }
    return relationship.data;
}

function shouldShowContent(resource: JsonApiResource, selectedAnswerIds: ReadonlySet<string>): boolean {
    const showWithoutAnswers = getShowWithoutAnswers(resource);
    if (selectedAnswerIds.size === 0) {
        return showWithoutAnswers;
    }
    if (showWithoutAnswers) {
        return true;
    }

    return getRelationshipIdentifiers(resource, "field_answer_options").some((identifier) =>
        selectedAnswerIds.has(identifier.id),
    );
}

function getShowWithoutAnswers(resource: JsonApiResource): boolean {
    if (resource.type === "node--shared_content") {
        return parseAttributes(resource, articleAttributesSchema).field_show_without_answers;
    }
    if (resource.type === "paragraph--accordion_item") {
        return parseAttributes(resource, faqAttributesSchema).field_show_without_answers;
    }
    throw new SharedContentMappingError(`Innholdstypen støttes ikke: ${resource.type}`);
}

function mapResultContent(resource: JsonApiResource, resources: ReadonlyMap<string, JsonApiResource>): ResultContent {
    if (resource.type === "node--shared_content") {
        const attributes = parseAttributes(resource, articleAttributesSchema);
        if (!isSafeContentHref(attributes.source_url)) {
            throw new SharedContentMappingError("Artikkellenken har en protokoll som ikke er tillatt");
        }
        return {
            id: resource.id,
            type: "article",
            title: attributes.title,
            description: attributes.field_sc_intro.value,
            href: attributes.source_url,
        };
    }

    if (resource.type === "paragraph--accordion_item") {
        const attributes = parseAttributes(resource, faqAttributesSchema);
        return {
            id: resource.id,
            type: "faq",
            question: attributes.field_accordion_item_title,
            blocks: mapFaqAnswerBlocks(resource, attributes.field_accordion_item_content?.value, resources),
        };
    }

    throw new SharedContentMappingError(`Innholdstypen støttes ikke: ${resource.type}`);
}

function mapFaqAnswerBlocks(
    faqResource: JsonApiResource,
    fallbackHtml: string | undefined,
    resources: ReadonlyMap<string, JsonApiResource>,
): FaqAnswerBlock[] {
    const identifiers = getOptionalRelationshipIdentifiers(faqResource, "field_answer_blocks");
    if (identifiers) {
        if (identifiers.length === 0) {
            throw new SharedContentMappingError(`Spørsmålet mangler svarblokker: ${faqResource.id}`);
        }
        return identifiers.map((identifier) => mapFaqAnswerBlock(resources, identifier));
    }
    if (fallbackHtml !== undefined) {
        return [
            {
                id: `${faqResource.id}-html`,
                type: "html",
                html: sanitizeSharedContentHtml(fallbackHtml),
            },
        ];
    }
    throw new SharedContentMappingError(`Spørsmålet mangler svarinnhold: ${faqResource.id}`);
}

function mapFaqAnswerBlock(
    resources: ReadonlyMap<string, JsonApiResource>,
    identifier: JsonApiResourceIdentifier,
): FaqAnswerBlock {
    const resource = getResource(resources, identifier, identifier.type);

    if (resource.type === "paragraph--answer_html") {
        const attributes = parseAttributes(resource, answerHtmlAttributesSchema);
        return {
            id: resource.id,
            type: "html",
            html: sanitizeSharedContentHtml(attributes.rendered_html),
        };
    }
    if (resource.type === "paragraph--answer_link") {
        const attributes = parseAttributes(resource, answerLinkAttributesSchema);
        assertSafeContentHref(attributes.source_url, "Svarlenken");
        return {
            id: resource.id,
            type: "link",
            href: attributes.source_url,
            label: attributes.field_label,
        };
    }
    if (resource.type === "paragraph--answer_image") {
        const attributes = parseAttributes(resource, imageAttributesSchema);
        assertSafeImageSrc(attributes.source_url);
        return {
            id: resource.id,
            type: "image",
            image: {
                src: attributes.source_url,
                alt: attributes.alt,
                width: attributes.width,
                height: attributes.height,
            },
        };
    }
    if (resource.type === "paragraph--answer_video") {
        const attributes = parseAttributes(resource, answerVideoAttributesSchema);
        if (attributes.field_thumbnail) {
            assertSafeImageSrc(attributes.field_thumbnail.source_url);
        }
        const thumbnail = attributes.field_thumbnail
            ? {
                  thumbnail: {
                      src: attributes.field_thumbnail.source_url,
                      alt: attributes.field_thumbnail.alt,
                      width: attributes.field_thumbnail.width,
                      height: attributes.field_thumbnail.height,
                  },
              }
            : {};

        if (attributes.field_video_provider === "qbrick") {
            return {
                id: resource.id,
                type: "video",
                provider: "qbrick",
                mediaId: attributes.field_qbrick_media_id,
                title: attributes.field_title,
                ...(attributes.field_duration ? { duration: attributes.field_duration } : {}),
                ...thumbnail,
            };
        }

        assertSafeVimeoHref(attributes.source_url);
        return {
            id: resource.id,
            type: "video",
            provider: "vimeo",
            href: attributes.source_url,
            title: attributes.field_title,
            ...(attributes.field_duration ? { duration: attributes.field_duration } : {}),
            ...thumbnail,
        };
    }
    if (resource.type === "paragraph--answer_related_card") {
        const attributes = parseAttributes(resource, answerRelatedCardAttributesSchema);
        assertSafeContentHref(attributes.source_url, "Ressurslenken");
        return {
            id: resource.id,
            type: "related-card",
            href: attributes.source_url,
            title: attributes.field_title,
            ...(attributes.field_description ? { description: attributes.field_description } : {}),
            ...(attributes.field_source ? { source: attributes.field_source } : {}),
        };
    }

    throw new SharedContentMappingError(`Svarblokktypen støttes ikke: ${resource.type}`);
}

function getOptionalRelationshipIdentifiers(
    resource: JsonApiResource,
    relationshipName: string,
): JsonApiResourceIdentifier[] | undefined {
    const relationship = resource.relationships?.[relationshipName];
    if (!relationship) {
        return undefined;
    }
    if (!Array.isArray(relationship.data)) {
        throw new SharedContentMappingError(`Relasjonen må være en liste: ${resource.type}.${relationshipName}`);
    }
    return relationship.data;
}

function assertSafeContentHref(href: string, label: string): void {
    if (!isSafeContentHref(href)) {
        throw new SharedContentMappingError(`${label} har en protokoll som ikke er tillatt`);
    }
}

function assertSafeImageSrc(src: string): void {
    if (!isSafeRelativeHref(src)) {
        throw new SharedContentMappingError("Bildefilen må bruke en lokal, relativ URL i mockspiken");
    }
}

function assertSafeVimeoHref(href: string): void {
    if (!isSafeVimeoHref(href)) {
        throw new SharedContentMappingError("Vimeo-lenken har en URL som ikke er tillatt");
    }
}

function isSafeVimeoHref(href: string): boolean {
    if (hasForbiddenUrlCharacters(href)) {
        return false;
    }

    try {
        const url = new URL(href);
        if (
            url.protocol !== "https:" ||
            url.username !== "" ||
            url.password !== "" ||
            url.port !== "" ||
            url.search !== "" ||
            url.hash !== ""
        ) {
            return false;
        }

        const pathSegments = url.pathname.split("/").filter(Boolean);
        if (url.hostname === "vimeo.com") {
            return pathSegments.length === 1 && /^\d+$/u.test(pathSegments[0] ?? "");
        }
        if (url.hostname === "player.vimeo.com") {
            return pathSegments.length === 2 && pathSegments[0] === "video" && /^\d+$/u.test(pathSegments[1] ?? "");
        }
        return false;
    } catch {
        return false;
    }
}

function isSafeContentHref(href: string): boolean {
    if (hasForbiddenUrlCharacters(href)) {
        return false;
    }
    if (isSafeRelativeHref(href)) {
        return true;
    }

    try {
        const url = new URL(href);
        return url.protocol === "https:" && url.username === "" && url.password === "";
    } catch {
        return false;
    }
}

function isSafeRelativeHref(href: string): boolean {
    if (!href.startsWith("/") || href.startsWith("//") || hasForbiddenUrlCharacters(href)) {
        return false;
    }
    try {
        return new URL(href, "https://arbeidsplassen.invalid").origin === "https://arbeidsplassen.invalid";
    } catch {
        return false;
    }
}

function hasForbiddenUrlCharacters(value: string): boolean {
    return (
        value !== value.trim() ||
        value.includes("\\") ||
        [...value].some((character) => {
            const codePoint = character.codePointAt(0);
            return codePoint !== undefined && (codePoint <= 31 || codePoint === 127);
        })
    );
}

function parseAttributes<T>(resource: JsonApiResource, schema: z.ZodType<T>): T {
    const parsed = schema.safeParse(resource.attributes);
    if (!parsed.success) {
        throw new SharedContentMappingError(`Ugyldige attributter for ${resource.type}`);
    }
    return parsed.data;
}
