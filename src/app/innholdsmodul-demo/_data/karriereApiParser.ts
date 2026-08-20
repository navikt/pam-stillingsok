import type {
    AccordionParagraph,
    HtmlParagraph,
    InnholdsmodulData,
    JsonApiIncluded,
    KarriereApiResponse,
    Paragraph,
    SpacerParagraph,
    TipHeadingParagraph,
    TitleTextImageParagraph,
} from "./types";

function normalizeParagraph(item: JsonApiIncluded, includedById: Map<string, JsonApiIncluded>): Paragraph | null {
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

        case "paragraph--accordion": {
            const itemRefs = item.relationships.field_accordion_items.data;
            const items = itemRefs
                .map((ref) => {
                    const child = includedById.get(ref.id);
                    if (child?.type !== "paragraph--accordion_item") {
                        return null;
                    }
                    return {
                        title: child.attributes.field_accordion_item_title,
                        html: child.attributes.field_accordion_item_content.processed,
                    };
                })
                .filter((i): i is { title: string; html: string } => i !== null);
            const result: AccordionParagraph = {
                type: "paragraph--accordion",
                id: item.id,
                style: item.attributes.field_accordion_style,
                items,
            };
            return result;
        }

        case "paragraph--accordion_item":
            return null;

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

        const paragraph = normalizeParagraph(item, includedById);
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
