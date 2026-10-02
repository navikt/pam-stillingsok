import { z } from "zod";
import { buildArticleHref } from "@/features/ung/onboarding/domain/selectionParams";
import type {
    ArticleBlock,
    ArticleMetadata,
    ArticleSummary,
    Selection,
    SharedContentArticle,
} from "@/features/ung/onboarding/domain/types";
import type {
    JsonApiCollectionDocument,
    JsonApiDocument,
    JsonApiResource,
    JsonApiResourceIdentifier,
} from "@/features/ung/onboarding/server/jsonApiTypes";
import {
    METADATA_TERM_TYPES,
    matchArticles,
} from "@/features/ung/onboarding/server/live/sharedContentMetadataMapping.server";
import { isSafeContentHref, isSafeVimeoHref } from "@/features/ung/onboarding/server/mock/mockSharedContentAdapter";
import {
    sanitizeSharedContentArticleHtml,
    toPlainText,
} from "@/features/ung/onboarding/server/sanitizeSharedContentHtml.server";

export type LiveAdapterError = Readonly<{
    type: "invalid-contract" | "mapping";
    message: string;
    issuePaths: readonly string[];
}>;

export type LiveAdapterResult<T> = Readonly<{ ok: true; data: T }> | Readonly<{ ok: false; error: LiveAdapterError }>;

const ARTICLE_TYPE = "node--shared_content";

const formattedTextSchema = z.object({
    value: z.string(),
    format: z.string().optional(),
});

const articleAttributesSchema = z.object({
    title: z.string().min(1),
    field_sc_intro: formattedTextSchema,
    source_url: z.string().min(1).max(2048).optional(),
});

const hideBlockSchema = z.object({
    field_hide_block: z.boolean().optional(),
});

const accordionItemAttributesSchema = z.object({
    field_accordion_item_title: z.string().min(1),
    field_accordion_item_content: formattedTextSchema,
    field_hide_block: z.boolean().optional(),
});

const remoteVideoAttributesSchema = z.object({
    name: z.string().min(1),
    field_media_oembed_video: z.string().min(1).max(2048),
});

const titleTextImageAttributesSchema = z.object({
    field_tti_title: z.string().min(1),
    field_tti_content: formattedTextSchema.nullish(),
    field_tti_link: z
        .object({
            uri: z.string().min(1).max(2048),
            title: z.string().min(1),
        })
        .nullish(),
});

const lppHtmlAttributesSchema = z.object({
    field_lpp_html_content: formattedTextSchema,
});

const tipHeadingAttributesSchema = z.object({
    field_tip_heading_number: z.string().optional(),
    field_tip_heading_text: z.string().min(1),
});

class LiveAdapterFailure extends Error {
    readonly type: LiveAdapterError["type"];
    readonly issuePaths: readonly string[];

    constructor(type: LiveAdapterError["type"], message: string, issuePaths: readonly string[] = []) {
        super(message);
        this.name = "LiveAdapterFailure";
        this.type = type;
        this.issuePaths = issuePaths;
    }
}

export function mapArticleCollection(
    document: JsonApiCollectionDocument,
    selection: Selection,
): LiveAdapterResult<readonly ArticleSummary[]> {
    return run(() => {
        const summaries = document.data.map((resource) => mapArticleSummary(resource, selection));
        return matchArticles(summaries, selection);
    });
}

export function mapArticle(document: JsonApiDocument): LiveAdapterResult<SharedContentArticle> {
    return run(() => {
        const top = document.data;
        if (top.type !== ARTICLE_TYPE) {
            throw new LiveAdapterFailure("invalid-contract", "Uventet toppressurs for artikkel", ["data.type"]);
        }

        const resources = buildResourceIndex(document);
        const attributes = parseAttributes(top, articleAttributesSchema);
        const sourceUrl = attributes.source_url;

        const blocks = getRelationshipList(top, "field_sc_content").flatMap((identifier) => {
            const block = mapBlock(getResource(resources, identifier), resources);
            return block ? [block] : [];
        });

        const webformId = getWebformId(top);

        return {
            id: top.id,
            title: attributes.title,
            intro: toPlainText(attributes.field_sc_intro.value),
            ...(sourceUrl !== undefined && isSafeContentHref(sourceUrl) ? { sourceUrl } : {}),
            blocks,
            ...(webformId === undefined ? {} : { webformId }),
        };
    });
}

function run<T>(mapper: () => T): LiveAdapterResult<T> {
    try {
        return { ok: true, data: mapper() };
    } catch (error) {
        if (error instanceof LiveAdapterFailure) {
            return {
                ok: false,
                error: { type: error.type, message: error.message, issuePaths: error.issuePaths },
            };
        }
        throw error;
    }
}

function mapArticleSummary(resource: JsonApiResource, selection: Selection): ArticleSummary {
    if (resource.type !== ARTICLE_TYPE) {
        throw new LiveAdapterFailure("invalid-contract", "Samlingen inneholder en uventet ressurstype", ["data"]);
    }
    const attributes = parseAttributes(resource, articleAttributesSchema);
    const metadata: ArticleMetadata = {
        ageTermIds: getTermIds(resource, "field_sc_age", METADATA_TERM_TYPES.age),
        experienceTermIds: getTermIds(resource, "field_sc_experience", METADATA_TERM_TYPES.experience),
        audienceTermIds: getTermIds(resource, "field_sc_audiences", METADATA_TERM_TYPES.audience),
    };

    return {
        id: resource.id,
        title: attributes.title,
        description: toPlainText(attributes.field_sc_intro.value),
        href: buildArticleHref(resource.id, selection),
        metadata,
    };
}

// Manglende eller tom relasjon gir tom liste, som aldri matcher et valgt filter.
function getTermIds(resource: JsonApiResource, relationshipName: string, expectedType: string): readonly string[] {
    const data = resource.relationships?.[relationshipName]?.data;
    if (data === undefined || data === null) {
        return [];
    }
    const identifiers = Array.isArray(data) ? data : [data];
    return identifiers.map((identifier) => {
        if (identifier.type !== expectedType) {
            throw new LiveAdapterFailure("invalid-contract", `Uventet termtype i ${relationshipName}`, [
                `relationships.${relationshipName}`,
            ]);
        }
        return identifier.id;
    });
}

function mapBlock(
    resource: JsonApiResource,
    resources: ReadonlyMap<string, JsonApiResource>,
): ArticleBlock | undefined {
    if (parseAttributes(resource, hideBlockSchema).field_hide_block === true) {
        return undefined;
    }

    switch (resource.type) {
        case "paragraph--accordion": {
            const items = getRelationshipList(resource, "field_accordion_items").flatMap((identifier) => {
                const itemResource = getResource(resources, identifier, "paragraph--accordion_item");
                const item = parseAttributes(itemResource, accordionItemAttributesSchema);
                if (item.field_hide_block === true) {
                    return [];
                }
                return [
                    {
                        id: itemResource.id,
                        title: item.field_accordion_item_title,
                        html: sanitizeSharedContentArticleHtml(item.field_accordion_item_content.value),
                    },
                ];
            });
            if (items.length === 0) {
                throw new LiveAdapterFailure("invalid-contract", "Accordion mangler elementer", [
                    "relationships.field_accordion_items",
                ]);
            }
            return { id: resource.id, type: "accordion", items };
        }
        case "paragraph--video": {
            const media = getSingleRelated(resource, "field_video_media", resources, "media--remote_video");
            const attributes = parseAttributes(media, remoteVideoAttributesSchema);
            if (!isSafeVimeoHref(attributes.field_media_oembed_video)) {
                throw new LiveAdapterFailure("invalid-contract", "Videoleverandøren eller URL-en støttes ikke", [
                    "attributes.field_media_oembed_video",
                ]);
            }
            return {
                id: resource.id,
                type: "video",
                provider: "vimeo",
                title: attributes.name,
                href: attributes.field_media_oembed_video,
            };
        }
        case "paragraph--title_text_image": {
            const attributes = parseAttributes(resource, titleTextImageAttributesSchema);
            const link = attributes.field_tti_link;
            if (link && !isSafeContentHref(link.uri)) {
                throw new LiveAdapterFailure("invalid-contract", "Lenken har en URL som ikke er tillatt", [
                    "attributes.field_tti_link",
                ]);
            }
            const content = attributes.field_tti_content?.value;
            return {
                id: resource.id,
                type: "title-text-image",
                title: attributes.field_tti_title,
                ...(content ? { html: sanitizeSharedContentArticleHtml(content) } : {}),
                ...(link ? { link: { href: link.uri, label: link.title } } : {}),
            };
        }
        case "paragraph--lpp_html": {
            const attributes = parseAttributes(resource, lppHtmlAttributesSchema);
            return {
                id: resource.id,
                type: "rich-text",
                html: sanitizeSharedContentArticleHtml(attributes.field_lpp_html_content.value),
            };
        }
        case "paragraph--tip_heading": {
            const attributes = parseAttributes(resource, tipHeadingAttributesSchema);
            return {
                id: resource.id,
                type: "heading",
                text: attributes.field_tip_heading_text,
                ...(attributes.field_tip_heading_number ? { number: attributes.field_tip_heading_number } : {}),
            };
        }
        case "paragraph--lpp_spacer":
            return { id: resource.id, type: "spacer" };
        default:
            throw new LiveAdapterFailure("invalid-contract", "Artikkelen har en blokktype som ikke støttes", [
                "data.relationships.field_sc_content",
            ]);
    }
}

function getWebformId(resource: JsonApiResource): string | undefined {
    const data = resource.relationships?.field_sc_webform?.data;
    if (data === undefined || data === null) {
        return undefined;
    }
    if (!("type" in data) || data.type !== "webform--webform" || !z.uuid().safeParse(data.id).success) {
        throw new LiveAdapterFailure("invalid-contract", "Webform-relasjonen er ugyldig", [
            "relationships.field_sc_webform",
        ]);
    }
    return data.id;
}

function buildResourceIndex(document: JsonApiDocument): ReadonlyMap<string, JsonApiResource> {
    const index = new Map<string, JsonApiResource>();
    for (const resource of [document.data, ...document.included]) {
        const key = resourceKey(resource);
        if (index.has(key)) {
            throw new LiveAdapterFailure("invalid-contract", "Dokumentet har duplikate ressurser", ["included"]);
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
    expectedType?: string,
): JsonApiResource {
    if (expectedType !== undefined && identifier.type !== expectedType) {
        throw new LiveAdapterFailure("invalid-contract", "Relasjonen peker på en uventet ressurstype", ["included"]);
    }
    const resource = resources.get(resourceKey(identifier));
    if (!resource) {
        throw new LiveAdapterFailure("invalid-contract", "Relasjonen peker på en ressurs som mangler i included", [
            "included",
        ]);
    }
    return resource;
}

function getRelationshipList(resource: JsonApiResource, relationshipName: string): JsonApiResourceIdentifier[] {
    const data = resource.relationships?.[relationshipName]?.data;
    if (!Array.isArray(data)) {
        throw new LiveAdapterFailure("invalid-contract", `Mangler liste-relasjon ${relationshipName}`, [
            `relationships.${relationshipName}`,
        ]);
    }
    return data;
}

function getSingleRelated(
    resource: JsonApiResource,
    relationshipName: string,
    resources: ReadonlyMap<string, JsonApiResource>,
    expectedType: string,
): JsonApiResource {
    const data = resource.relationships?.[relationshipName]?.data;
    if (data === undefined || data === null || !("type" in data)) {
        throw new LiveAdapterFailure("invalid-contract", `Mangler enkelt-relasjon ${relationshipName}`, [
            `relationships.${relationshipName}`,
        ]);
    }
    return getResource(resources, data, expectedType);
}

function parseAttributes<T>(resource: JsonApiResource, schema: z.ZodType<T>): T {
    const parsed = schema.safeParse(resource.attributes);
    if (!parsed.success) {
        throw new LiveAdapterFailure(
            "invalid-contract",
            `Ugyldige attributter for ${resource.type}`,
            parsed.error.issues.map((issue) => `attributes.${issue.path.join(".")}`),
        );
    }
    return parsed.data;
}
