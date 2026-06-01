import type {
    AccordionParagraph,
    CtaGridParagraph,
    CtaParagraph,
    HtmlParagraph,
    InnholdsmodulData,
    JsonApiIncluded,
    KarriereApiResponse,
    Paragraph,
    SpacerParagraph,
    TipHeadingParagraph,
    TitleTextImageParagraph,
} from "./types";

function normalizeParagraph(item: JsonApiIncluded): Paragraph | null {
    if (Object.hasOwn(item.attributes, "field_hide_block")) {
        const attrs = item.attributes as { field_hide_block: boolean };
        if (attrs.field_hide_block) {
            return null;
        }
    }

    switch (item.type) {
        case "paragraph--tip_heading": {
            const result: TipHeadingParagraph = {
                type: "paragraph--tip_heading",
                id: item.id,
                number: item.attributes.field_tip_heading_number,
                text: item.attributes.field_tip_heading_text,
            };
            return result;
        }

        case "paragraph--lpp_html": {
            const result: HtmlParagraph = {
                type: "paragraph--lpp_html",
                id: item.id,
                html: item.attributes.field_lpp_html_content.processed,
            };
            return result;
        }

        case "paragraph--lpp_spacer": {
            const result: SpacerParagraph = {
                type: "paragraph--lpp_spacer",
                id: item.id,
            };
            return result;
        }

        case "paragraph--title_text_image": {
            const result: TitleTextImageParagraph = {
                type: "paragraph--title_text_image",
                id: item.id,
                html: item.attributes.field_tti_content.processed,
                layout: item.attributes.field_tti_layout,
                title: item.attributes.field_tti_title,
            };
            return result;
        }

        case "paragraph--lpp_accordion": {
            const result: AccordionParagraph = {
                type: "paragraph--lpp_accordion",
                id: item.id,
                items: item.attributes.field_accordion_items.map((i) => ({
                    title: i.title,
                    html: i.body.processed,
                })),
            };
            return result;
        }

        case "paragraph--lpp_cta": {
            const result: CtaParagraph = {
                type: "paragraph--lpp_cta",
                id: item.id,
                title: item.attributes.field_cta_title,
                description: item.attributes.field_cta_description,
                href: item.attributes.field_cta_url.uri,
                linkText: item.attributes.field_cta_url.title,
            };
            return result;
        }

        case "paragraph--lpp_cta_grid": {
            const result: CtaGridParagraph = {
                type: "paragraph--lpp_cta_grid",
                id: item.id,
                heading: item.attributes.field_heading,
                items: item.attributes.field_cta_grid_items.map((i) => ({
                    title: i.title,
                    description: i.description,
                    href: i.url.uri,
                    linkText: i.url.title,
                })),
            };
            return result;
        }

        default:
            return null;
    }
}

export function parseKarriereApiResponse(response: KarriereApiResponse): InnholdsmodulData {
    const includedById = new Map<string, JsonApiIncluded>();
    for (const item of response.included) {
        includedById.set(item.id, item);
    }

    const contentRefs = response.data.relationships.field_innholdsmodul_content.data;
    const paragraphs: Paragraph[] = [];

    for (const ref of contentRefs) {
        const item = includedById.get(ref.id);
        if (!item) {
            continue;
        }

        const paragraph = normalizeParagraph(item);
        if (paragraph) {
            paragraphs.push(paragraph);
        }
    }

    const situationRefs = response.data.relationships.field_innholdsmodul_situations?.data ?? [];
    const situations: string[] = situationRefs
        .map((ref) => {
            const item = includedById.get(ref.id);
            if (item?.type === "taxonomy_term--situations") {
                return item.attributes.name;
            }
            return null;
        })
        .filter((name): name is string => name !== null);

    return {
        id: response.data.id,
        title: response.data.attributes.title,
        situations,
        paragraphs,
    };
}
