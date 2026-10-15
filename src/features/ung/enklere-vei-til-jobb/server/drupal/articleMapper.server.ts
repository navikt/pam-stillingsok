import "server-only";
import { z } from "zod";
import { appLogger } from "@/app/_common/logging/appLogger";
import type {
    Article,
    ArticleBlock,
    ArticleHeading,
    ArticleHeadingLevel,
    SharedContentImage,
} from "@/features/ung/enklere-vei-til-jobb/domain/article";
import type { OnboardingModule, Selection } from "@/features/ung/enklere-vei-til-jobb/domain/onboarding";
import type { ArticleResultContent } from "@/features/ung/enklere-vei-til-jobb/domain/results";
import { buildArticleHref } from "@/features/ung/enklere-vei-til-jobb/domain/selectionParams";
import type {
    JsonApiCollectionDocument,
    JsonApiDocument,
    JsonApiResource,
} from "@/features/ung/enklere-vei-til-jobb/server/drupal/jsonApi";
import {
    buildCollectionResourceIndex,
    buildResourceIndex,
    getRelationshipList,
    getResource,
    parseAttributes,
    type ResourceIndex,
    resourceKey,
    runMapping,
    SharedContentMappingError,
} from "@/features/ung/enklere-vei-til-jobb/server/drupal/jsonApi";
import {
    sanitizeSharedContentArticleHtml,
    toPlainText,
} from "@/features/ung/enklere-vei-til-jobb/server/sanitizeSharedContentHtml.server";
import type { SharedContentResult } from "@/features/ung/enklere-vei-til-jobb/server/sharedContentResult";
import {
    isSafeContentHref,
    isSafeRelativeHref,
    isSafeVimeoHref,
} from "@/features/ung/enklere-vei-til-jobb/server/urlSafety";

const ARTICLE_TYPE = "node--shared_content";
const MEDIA_IMAGE_TYPE = "media--image";
const FILE_TYPE = "file--file";

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

// field_sc_teaser_image/field_seo_image peker direkte på file--file, uten media--image-leddet som
// garanterer bredde/høyde i field_media_image-meta. I staging har teaserbildet alt-tekst, men
// width/height er null. Listevisningen bruker en fast visningsstørrelse, så width/height er bare
// et påkrevd next/image-prop, ikke et reelt sideforhold, og får en firkantet fallback når Drupal
// mangler dem.
const TEASER_IMAGE_FALLBACK_SIZE = 60;
const teaserImageMetaSchema = z.object({
    alt: z.string().optional(),
    width: z.coerce.number().int().positive().nullish(),
    height: z.coerce.number().int().positive().nullish(),
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

const headingLevelSchema = z
    .enum(["h2", "h3", "h4"])
    .nullish()
    .transform((level): ArticleHeadingLevel => {
        switch (level) {
            case "h3":
                return "3";
            case "h4":
                return "4";
            default:
                return "2";
        }
    });

const optionalHeadingSchema = z
    .string()
    .nullish()
    .transform((heading) => {
        const trimmedHeading = heading?.trim();
        return trimmedHeading ? trimmedHeading : undefined;
    });

// Manglende eller null verdi tolkes som "primary" for bakoverkompatibilitet. En verdi utenfor
// enumet skal gi valideringsfeil, ikke stille fallback (se parseAttributes).
const accordionAttributesSchema = z.object({
    field_accordion_style: z.enum(["primary", "secondary"]).nullish(),
    field_accordion_heading: optionalHeadingSchema,
    field_accordion_heading_level: headingLevelSchema,
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
    field_tti_heading_level: headingLevelSchema,
});

const lppHtmlAttributesSchema = z.object({
    field_lpp_html_content: formattedTextSchema,
});

const tipHeadingAttributesSchema = z.object({
    field_tip_heading_number: z.string().optional(),
    field_tip_heading_text: z.string().min(1),
    field_tip_heading_level: headingLevelSchema,
});

const videoAttributesSchema = z.object({
    field_video_heading: optionalHeadingSchema,
    field_video_heading_level: headingLevelSchema,
});

export function mapArticleCollection(
    document: JsonApiCollectionDocument,
    selection: Selection,
    module: OnboardingModule,
    imageBaseUrl?: string,
): SharedContentResult<readonly ArticleResultContent[]> {
    return runMapping(() => {
        const resources = buildCollectionResourceIndex(document);
        return document.data.map((resource) => mapArticleSummary(resource, selection, module, resources, imageBaseUrl));
    });
}

export function mapArticle(document: JsonApiDocument, imageBaseUrl?: string): SharedContentResult<Article> {
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

        return {
            id: top.id,
            title: attributes.title,
            intro: toPlainText(attributes.field_sc_intro.value),
            blocks,
            ...(webformId === undefined ? {} : { webformId }),
        };
    });
}

function mapArticleSummary(
    resource: JsonApiResource,
    selection: Selection,
    module: OnboardingModule,
    resources: ResourceIndex,
    imageBaseUrl?: string,
): ArticleResultContent {
    if (resource.type !== ARTICLE_TYPE) {
        throw new SharedContentMappingError("Samlingen inneholder en uventet ressurstype", ["data"]);
    }
    const attributes = parseAttributes(resource, articleAttributesSchema);
    const image = getArticleListImage(resource, resources, imageBaseUrl);

    return {
        id: resource.id,
        type: "article",
        title: attributes.title,
        description: toPlainText(attributes.field_sc_intro.value),
        href: buildArticleHref(resource.id, selection, module),
        ...(image ? { image } : {}),
    };
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
            const { field_accordion_style, field_accordion_heading, field_accordion_heading_level } = parseAttributes(
                resource,
                accordionAttributesSchema,
            );
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
            return {
                id: resource.id,
                type: "accordion",
                style: field_accordion_style ?? "primary",
                ...(field_accordion_heading
                    ? { heading: toArticleHeading(field_accordion_heading, field_accordion_heading_level) }
                    : {}),
                items,
            };
        }
        case "paragraph--video": {
            const videoAttributes = parseAttributes(resource, videoAttributesSchema);
            const media = getSingleRelated(resource, "field_video_media", resources, "media--remote_video");
            const attributes = parseAttributes(media, remoteVideoAttributesSchema);
            if (!isSafeVimeoHref(attributes.field_media_oembed_video)) {
                appLogger.warn("Hopper over en artikkelvideo med en leverandør eller URL som ikke støttes", {
                    blockId: resource.id,
                });
                return undefined;
            }
            const thumbnailSrc = getVideoThumbnail(media, resources, imageBaseUrl);
            return {
                id: resource.id,
                type: "video",
                provider: "vimeo",
                title: attributes.name,
                href: attributes.field_media_oembed_video,
                ...(videoAttributes.field_video_heading
                    ? {
                          heading: toArticleHeading(
                              videoAttributes.field_video_heading,
                              videoAttributes.field_video_heading_level,
                          ),
                      }
                    : {}),
                ...(thumbnailSrc ? { thumbnailSrc } : {}),
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
                headingLevel: attributes.field_tti_heading_level,
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
                level: attributes.field_tip_heading_level,
                ...(attributes.field_tip_heading_number ? { number: attributes.field_tip_heading_number } : {}),
            };
        }
        case "paragraph--lpp_spacer":
            return { id: resource.id, type: "spacer" };
        default:
            appLogger.warn("Hopper over en artikkelblokk som ikke støttes", {
                blockId: resource.id,
                blockType: resource.type,
            });
            return undefined;
    }
}

function toArticleHeading(text: string, level: ArticleHeadingLevel): ArticleHeading {
    return { text, level };
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
    if (imageData === undefined || imageData === null) {
        return undefined;
    }
    if (Array.isArray(imageData)) {
        throw new SharedContentMappingError("Bildet har en flerverdirelasjon der én ressurs var forventet", [
            "relationships.field_tti_image",
        ]);
    }

    const media = getResource(resources, imageData, MEDIA_IMAGE_TYPE);
    const fileData = media.relationships?.field_media_image?.data;
    if (fileData === undefined || fileData === null || Array.isArray(fileData)) {
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

/**
 * Henter `thumbnail`-relasjonen (file--file) på en media--remote_video-ressurs, hvis den finnes.
 * Thumbnailen er en enhancement, ikke et krav: Drupal genererer den automatisk fra oEmbed-data og
 * filen kan mangle på fil-proxyen selv om relasjonen er til stede i JSON:API-responsen. Derfor
 * kaster vi ikke SharedContentMappingError her, bare dropper thumbnailen og faller tilbake til
 * placeholderen i UI-et.
 */
function getVideoThumbnail(
    media: JsonApiResource,
    resources: ResourceIndex,
    imageBaseUrl?: string,
): string | undefined {
    const thumbnailData = media.relationships?.thumbnail?.data;
    if (thumbnailData === undefined || thumbnailData === null || !("type" in thumbnailData)) {
        return undefined;
    }
    if (thumbnailData.type !== FILE_TYPE) {
        return undefined;
    }
    const file = resources.get(resourceKey(thumbnailData));
    if (!file) {
        return undefined;
    }
    const parsed = fileAttributesSchema.safeParse(file.attributes);
    if (!parsed.success) {
        return undefined;
    }
    const src = resolveImageUrl(parsed.data.uri.url, imageBaseUrl);
    return isAbsoluteSafeContentHref(src) ? src : undefined;
}

/**
 * Henter listebildet på en artikkel: foretrekker `field_sc_teaser_image`, med `field_seo_image`
 * som reserve, se feature-README-en. Begge peker direkte på
 * file--file (ingen media--image-mellomledd). Bildet er en enhancement i resultatlister, så en
 * manglende eller ufullstendig relasjon dropper bare bildet i stedet for å feile hele samlingen.
 */
function getArticleListImage(
    resource: JsonApiResource,
    resources: ResourceIndex,
    imageBaseUrl?: string,
): SharedContentImage | undefined {
    return (
        resolveFileImageRelationship(resource, "field_sc_teaser_image", resources, imageBaseUrl) ??
        resolveFileImageRelationship(resource, "field_seo_image", resources, imageBaseUrl)
    );
}

function resolveFileImageRelationship(
    resource: JsonApiResource,
    relationshipName: string,
    resources: ResourceIndex,
    imageBaseUrl?: string,
): SharedContentImage | undefined {
    const fileData = resource.relationships?.[relationshipName]?.data;
    if (fileData === undefined || fileData === null || !("type" in fileData) || fileData.type !== FILE_TYPE) {
        return undefined;
    }

    const meta = teaserImageMetaSchema.safeParse(fileData.meta);
    if (!meta.success) {
        return undefined;
    }

    const file = resources.get(resourceKey(fileData));
    if (!file) {
        return undefined;
    }
    const parsedFile = fileAttributesSchema.safeParse(file.attributes);
    if (!parsedFile.success) {
        return undefined;
    }

    const src = resolveImageUrl(parsedFile.data.uri.url, imageBaseUrl);
    if (!isAbsoluteSafeContentHref(src)) {
        return undefined;
    }

    return {
        src,
        alt: meta.data.alt ?? "",
        width: meta.data.width ?? TEASER_IMAGE_FALLBACK_SIZE,
        height: meta.data.height ?? TEASER_IMAGE_FALLBACK_SIZE,
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
