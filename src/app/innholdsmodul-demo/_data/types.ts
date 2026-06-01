// Raw JSON:API response types

type JsonApiParagraphRef = {
    type: string;
    id: string;
};

type JsonApiNode = {
    type: "node--innholdsmodul";
    id: string;
    attributes: {
        title: string;
        path: { alias: string };
    };
    relationships: {
        field_innholdsmodul_content: { data: JsonApiParagraphRef[] };
        field_innholdsmodul_situations?: { data: JsonApiParagraphRef[] };
    };
};

type JsonApiTipHeading = {
    type: "paragraph--tip_heading";
    id: string;
    attributes: {
        field_tip_heading_number: string;
        field_tip_heading_text: string;
        field_hide_block: boolean;
    };
};

type JsonApiLppHtml = {
    type: "paragraph--lpp_html";
    id: string;
    attributes: {
        field_lpp_html_content: { processed: string };
        field_hide_block: boolean;
    };
};

type JsonApiLppSpacer = {
    type: "paragraph--lpp_spacer";
    id: string;
    attributes: { field_hide_block: boolean };
};

type JsonApiTitleTextImage = {
    type: "paragraph--title_text_image";
    id: string;
    attributes: {
        field_tti_content: { processed: string };
        field_tti_layout: string;
        field_tti_style: string;
        field_tti_title: string | null;
        field_hide_block: boolean;
    };
};

type JsonApiAccordion = {
    type: "paragraph--lpp_accordion";
    id: string;
    attributes: {
        field_accordion_items: Array<{
            title: string;
            body: { processed: string };
        }>;
        field_hide_block: boolean;
    };
};

type JsonApiCta = {
    type: "paragraph--lpp_cta";
    id: string;
    attributes: {
        field_cta_title: string;
        field_cta_description: string;
        field_cta_url: { uri: string; title: string };
        field_hide_block: boolean;
    };
};

type JsonApiCtaGrid = {
    type: "paragraph--lpp_cta_grid";
    id: string;
    attributes: {
        field_heading?: string;
        field_cta_grid_items: Array<{
            title: string;
            description: string;
            url: { uri: string; title: string };
        }>;
        field_hide_block: boolean;
    };
};

type JsonApiSituationsTerm = {
    type: "taxonomy_term--situations";
    id: string;
    attributes: {
        name: string;
        path: { alias: string };
    };
};

export type JsonApiIncluded =
    | JsonApiTipHeading
    | JsonApiLppHtml
    | JsonApiLppSpacer
    | JsonApiTitleTextImage
    | JsonApiAccordion
    | JsonApiCta
    | JsonApiCtaGrid
    | JsonApiSituationsTerm;

export type KarriereApiResponse = {
    data: JsonApiNode;
    included: JsonApiIncluded[];
};

// Normalized types used by components

export type TipHeadingParagraph = {
    type: "paragraph--tip_heading";
    id: string;
    number: string;
    text: string;
};

export type HtmlParagraph = {
    type: "paragraph--lpp_html";
    id: string;
    html: string;
};

export type SpacerParagraph = {
    type: "paragraph--lpp_spacer";
    id: string;
};

export type TitleTextImageParagraph = {
    type: "paragraph--title_text_image";
    id: string;
    html: string;
    layout: string;
    title: string | null;
};

export type AccordionParagraph = {
    type: "paragraph--lpp_accordion";
    id: string;
    items: Array<{ title: string; html: string }>;
};

export type CtaParagraph = {
    type: "paragraph--lpp_cta";
    id: string;
    title: string;
    description: string;
    href: string;
    linkText: string;
};

export type CtaGridParagraph = {
    type: "paragraph--lpp_cta_grid";
    id: string;
    heading?: string;
    items: Array<{ title: string; description: string; href: string; linkText: string }>;
};

export type Paragraph =
    | TipHeadingParagraph
    | HtmlParagraph
    | SpacerParagraph
    | TitleTextImageParagraph
    | AccordionParagraph
    | CtaParagraph
    | CtaGridParagraph;

export type InnholdsmodulData = {
    id: string;
    title: string;
    situations: string[];
    paragraphs: Paragraph[];
};
