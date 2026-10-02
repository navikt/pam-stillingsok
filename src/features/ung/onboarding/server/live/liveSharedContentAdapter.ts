import { z } from "zod";
import { buildArticleHref } from "@/features/ung/onboarding/domain/selectionParams";
import type {
    ArticleBlock,
    ArticleMetadata,
    ArticleMetadataNames,
    ArticleSummary,
    Selection,
    SharedContentArticle,
    SharedContentImage,
} from "@/features/ung/onboarding/domain/types";
import {
    buildResourceIndex,
    getRelationshipList,
    getResource,
    parseAttributes,
    type ResourceIndex,
    resourceKey,
    runMapping,
    SharedContentMappingError,
} from "@/features/ung/onboarding/server/jsonApiMapping";
import type {
    JsonApiCollectionDocument,
    JsonApiDocument,
    JsonApiResource,
} from "@/features/ung/onboarding/server/jsonApiTypes";
import {
    METADATA_TERM_TYPES,
    matchArticles,
} from "@/features/ung/onboarding/server/live/sharedContentMetadataMapping.server";
import {
    sanitizeSharedContentArticleHtml,
    toPlainText,
} from "@/features/ung/onboarding/server/sanitizeSharedContentHtml.server";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";
import { isSafeContentHref, isSafeRelativeHref, isSafeVimeoHref } from "@/features/ung/onboarding/server/urlSafety";

const ARTICLE_TYPE = "node--shared_content";
const SITE_TERM_TYPE = "taxonomy_term--shared_content_sites";
const MEDIA_IMAGE_TYPE = "media--image";
const FILE_TYPE = "file--file";

const taxonomyTermNameSchema = z.object({ name: z.string().min(1) });

const fileAttributesSchema = z.object({
    uri: z.object({ url: z.string().min(1).max(2048) }),
});

// Drupal legger alt/title/bredde/høyde i meta på resource-identifikatoren for bildefeltet
// (field_media_image), ikke i attributes. Tomt alt-tekst er gyldig (dekorativt bilde).
const imageFieldMetaSchema = z.object({
    alt: z.string().optional(),
    width: z.coerce.number().int().positive(),
    height: z.coerce.number().int().positive(),
});

const formattedTextSchema = z.object({
    value: z.string(),
    format: z.string().optional(),
});

const articleAttributesSchema = z.object({
    title: z.string().min(1),
    field_sc_intro: formattedTextSchema,
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
    field_tti_layout: z.enum(["img_left", "img_right"]).nullish(),
    field_tti_style: z.enum(["simple", "coloured_box"]).nullish(),
});

const lppHtmlAttributesSchema = z.object({
    field_lpp_html_content: formattedTextSchema,
});

const tipHeadingAttributesSchema = z.object({
    field_tip_heading_number: z.string().optional(),
    field_tip_heading_text: z.string().min(1),
});

export function mapArticleCollection(
    document: JsonApiCollectionDocument,
    selection: Selection,
): SharedContentResult<readonly ArticleSummary[]> {
    return runMapping(() => {
        const summaries = document.data.map((resource) => mapArticleSummary(resource, selection));
        return matchArticles(summaries, selection);
    });
}

export function mapArticle(
    document: JsonApiDocument,
    imageBaseUrl?: string,
): SharedContentResult<SharedContentArticle> {
    return runMapping(() => {
        const top = document.data;
        if (top.type !== ARTICLE_TYPE) {
            throw new SharedContentMappingError("Uventet toppressurs for artikkel", ["data.type"]);
        }

        const resources = buildResourceIndex(document);
        const attributes = parseAttributes(top, articleAttributesSchema);

        const blocks = getRelationshipList(top, "field_sc_content").flatMap((identifier) => {
            const block = mapBlock(getResource(resources, identifier), resources, imageBaseUrl);
            return block ? [block] : [];
        });

        const webformId = getWebformId(top);
        const metadataNames = getMetadataNames(top, resources);

        return {
            id: top.id,
            title: attributes.title,
            intro: toPlainText(attributes.field_sc_intro.value),
            blocks,
            ...(webformId === undefined ? {} : { webformId }),
            metadataNames,
        };
    });
}

function mapArticleSummary(resource: JsonApiResource, selection: Selection): ArticleSummary {
    if (resource.type !== ARTICLE_TYPE) {
        throw new SharedContentMappingError("Samlingen inneholder en uventet ressurstype", ["data"]);
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
            throw new SharedContentMappingError(`Uventet termtype i ${relationshipName}`, [
                `relationships.${relationshipName}`,
            ]);
        }
        return identifier.id;
    });
}

function mapBlock(
    resource: JsonApiResource,
    resources: ResourceIndex,
    imageBaseUrl?: string,
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
                throw new SharedContentMappingError("Accordion mangler elementer", [
                    "relationships.field_accordion_items",
                ]);
            }
            return { id: resource.id, type: "accordion", items };
        }
        case "paragraph--video": {
            const media = getSingleRelated(resource, "field_video_media", resources, "media--remote_video");
            const attributes = parseAttributes(media, remoteVideoAttributesSchema);
            if (!isSafeVimeoHref(attributes.field_media_oembed_video)) {
                throw new SharedContentMappingError("Videoleverandøren eller URL-en støttes ikke", [
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
                throw new SharedContentMappingError("Lenken har en URL som ikke er tillatt", [
                    "attributes.field_tti_link",
                ]);
            }
            const content = attributes.field_tti_content?.value;
            const image = getTitleTextImage(resource, resources, imageBaseUrl);
            return {
                id: resource.id,
                type: "title-text-image",
                title: attributes.field_tti_title,
                layout: attributes.field_tti_layout === "img_left" ? "left" : "right",
                style: attributes.field_tti_style === "coloured_box" ? "coloured-box" : "simple",
                ...(content ? { html: sanitizeSharedContentArticleHtml(content) } : {}),
                ...(link ? { link: { href: link.uri, label: link.title } } : {}),
                ...(image ? { image } : {}),
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
            throw new SharedContentMappingError("Artikkelen har en blokktype som ikke støttes", [
                "data.relationships.field_sc_content",
            ]);
    }
}

/**
 * Henter menneskelesbare navn for debug-metadata. I motsetning til getTermIds skal dette aldri feile
 * artikkelen: termer Drupal har utelatt pga. manglende tilgang (meta.omitted) telles i omittedCount
 * i stedet for å kaste en kontraktfeil, siden dette bare brukes til verifisering.
 */
function getMetadataNames(resource: JsonApiResource, resources: ResourceIndex): ArticleMetadataNames {
    let omittedCount = 0;
    const resolveNames = (relationshipName: string, expectedType: string): readonly string[] => {
        const data = resource.relationships?.[relationshipName]?.data;
        if (data === undefined || data === null) {
            return [];
        }
        const identifiers = Array.isArray(data) ? data : [data];
        const names: string[] = [];
        for (const identifier of identifiers) {
            if (identifier.type !== expectedType) {
                omittedCount += 1;
                continue;
            }
            const related = resources.get(resourceKey(identifier));
            const parsed = related ? taxonomyTermNameSchema.safeParse(related.attributes) : undefined;
            if (parsed?.success) {
                names.push(parsed.data.name);
            } else {
                omittedCount += 1;
            }
        }
        return names;
    };

    const owner = resolveNames("field_sc_owner", SITE_TERM_TYPE);
    return {
        ...(owner[0] !== undefined ? { owner: owner[0] } : {}),
        availableTo: resolveNames("field_sc_available_to", SITE_TERM_TYPE),
        audiences: resolveNames("field_sc_audiences", METADATA_TERM_TYPES.audience),
        age: resolveNames("field_sc_age", METADATA_TERM_TYPES.age),
        experience: resolveNames("field_sc_experience", METADATA_TERM_TYPES.experience),
        omittedCount,
    };
}

/**
 * Henter bildet i en title_text_image-blokk via media--image og file--file. field_tti_image kan
 * mangle (ikke alle blokker har bilde), men hvis relasjonen finnes må hele kjeden være gyldig.
 */
function getTitleTextImage(
    resource: JsonApiResource,
    resources: ResourceIndex,
    imageBaseUrl?: string,
): SharedContentImage | undefined {
    const imageData = resource.relationships?.field_tti_image?.data;
    if (imageData === undefined || imageData === null || !("type" in imageData)) {
        return undefined;
    }

    const media = getResource(resources, imageData, MEDIA_IMAGE_TYPE);
    const fileData = media.relationships?.field_media_image?.data;
    if (fileData === undefined || fileData === null || !("type" in fileData)) {
        throw new SharedContentMappingError("Bildet mangler fil-relasjonen field_media_image", [
            "relationships.field_tti_image.relationships.field_media_image",
        ]);
    }

    const meta = imageFieldMetaSchema.safeParse(fileData.meta);
    if (!meta.success) {
        throw new SharedContentMappingError("Bildet mangler alt-tekst, bredde eller høyde", [
            "relationships.field_tti_image.relationships.field_media_image.meta",
        ]);
    }

    const file = parseAttributes(getResource(resources, fileData, FILE_TYPE), fileAttributesSchema);
    // Drupal returnerer ofte en relativ filsti (f.eks. /sites/default/files/...). Den må gjøres
    // absolutt mot CMS-origin for at next/image skal kunne hente den fra en godkjent remotePattern.
    const src = resolveImageUrl(file.uri.url, imageBaseUrl);
    if (!isAbsoluteSafeContentHref(src)) {
        throw new SharedContentMappingError("Bilde-URL-en har en protokoll som ikke er tillatt", [
            "relationships.field_tti_image.relationships.field_media_image.attributes.uri",
        ]);
    }

    return {
        src,
        alt: meta.data.alt ?? "",
        width: meta.data.width,
        height: meta.data.height,
    };
}

function resolveImageUrl(url: string, imageBaseUrl?: string): string {
    if (imageBaseUrl && isSafeRelativeHref(url)) {
        return new URL(url, imageBaseUrl).toString();
    }
    return url;
}

function isAbsoluteSafeContentHref(href: string): boolean {
    if (!isSafeContentHref(href)) {
        return false;
    }
    try {
        return new URL(href).protocol === "https:";
    } catch {
        return false;
    }
}

function getWebformId(resource: JsonApiResource): string | undefined {
    const data = resource.relationships?.field_sc_webform?.data;
    if (data === undefined || data === null) {
        return undefined;
    }
    if (!("type" in data) || data.type !== "webform--webform" || !z.uuid().safeParse(data.id).success) {
        throw new SharedContentMappingError("Webform-relasjonen er ugyldig", ["relationships.field_sc_webform"]);
    }
    return data.id;
}

function getSingleRelated(
    resource: JsonApiResource,
    relationshipName: string,
    resources: ResourceIndex,
    expectedType: string,
): JsonApiResource {
    const data = resource.relationships?.[relationshipName]?.data;
    if (data === undefined || data === null || !("type" in data)) {
        throw new SharedContentMappingError(`Mangler enkelt-relasjon ${relationshipName}`, [
            `relationships.${relationshipName}`,
        ]);
    }
    return getResource(resources, data, expectedType);
}
