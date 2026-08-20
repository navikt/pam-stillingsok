import type { KarriereApiResponse } from "./types";

export const mockKarriereApiResponse: KarriereApiResponse = {
    data: {
        type: "node--innholdsmodul",
        id: "b0d5944f-46eb-4388-82f8-589a7045451b",
        attributes: {
            title: "4 steder du kan lete etter jobb",
            path: {
                alias: "/karrierevalg/6-steder-du-kan-lete-etter-jobb",
            },
        },
        relationships: {
            field_innholdsmodul_content: {
                data: [
                    { type: "paragraph--tip_heading", id: "509693c3-2879-4e06-8c0b-b1e1b7afe8fd" },
                    { type: "paragraph--lpp_html", id: "bfd884da-a664-469c-af03-6c2dd7faee1c" },
                    { type: "paragraph--lpp_spacer", id: "0cede427-8590-4055-8894-a98489a5a5c9" },
                    { type: "paragraph--tip_heading", id: "a1bac56f-f2ae-4f73-bee5-c9cf3d748d58" },
                    { type: "paragraph--lpp_html", id: "c4b262e9-ed61-4292-83f9-2cd5195862a9" },
                    { type: "paragraph--lpp_spacer", id: "7d2648af-55b0-44e1-86e7-bc856b293a40" },
                    { type: "paragraph--tip_heading", id: "bccc2e5d-1711-4fa6-9749-c52a9d78aff8" },
                    { type: "paragraph--title_text_image", id: "2e6d826c-ba07-42fa-894c-358a739f5116" },
                    { type: "paragraph--tip_heading", id: "4204b237-21cd-4a84-bdb6-d2f717d9ea7f" },
                    { type: "paragraph--lpp_html", id: "077571fa-0176-419c-b6d4-464aae966937" },
                ],
            },
            field_innholdsmodul_situations: {
                data: [
                    { type: "taxonomy_term--situations", id: "0890ec07-eb5a-4f95-b7e7-32d93fb73a4e" },
                    { type: "taxonomy_term--situations", id: "608e831c-5ea6-475e-99cf-8411f1192b68" },
                    { type: "taxonomy_term--situations", id: "0b4f70d1-15f7-4fd5-b1a3-db97e9efbdc6" },
                ],
            },
        },
    },
    included: [
        // Situations
        {
            type: "taxonomy_term--situations",
            id: "0890ec07-eb5a-4f95-b7e7-32d93fb73a4e",
            attributes: {
                name: "Verktøy for å søke jobb",
                path: { alias: "/karrierevalg/verktoy-soke-jobb" },
            },
        },
        {
            type: "taxonomy_term--situations",
            id: "608e831c-5ea6-475e-99cf-8411f1192b68",
            attributes: {
                name: "Nyutdannet og skal søke jobb",
                path: { alias: "/karrierevalg/nyutdannet-og-skal-soke-jobb" },
            },
        },
        {
            type: "taxonomy_term--situations",
            id: "0b4f70d1-15f7-4fd5-b1a3-db97e9efbdc6",
            attributes: {
                name: "Vil jobbe med noe annet",
                path: { alias: "/karrierevalg/vil-jobbe-med-noe-annet" },
            },
        },

        // Paragraph -- tip_heading (1)
        {
            type: "paragraph--tip_heading",
            id: "509693c3-2879-4e06-8c0b-b1e1b7afe8fd",
            attributes: {
                field_tip_heading_number: "1",
                field_tip_heading_text: "Jobbsøkerportaler",
                field_hide_block: false,
            },
        },

        // Paragraph -- lpp_html (1)
        {
            type: "paragraph--lpp_html",
            id: "bfd884da-a664-469c-af03-6c2dd7faee1c",
            attributes: {
                field_lpp_html_content: {
                    processed:
                        '<ul><li>Legg inn CV-en din på arbeidsplassen.no, finn.no, og andre jobbsøkerportaler. Da har du alt klart for å søke på jobber.</li><li>Søk smart! Bruk søkefeltet og filtrene. <a href="https://arbeidsplassen.nav.no/slik-bruker-du-det-nye-soket">Sjekk tips for hvordan gjøre gode søk på Arbeidsplassen.no</a>.</li></ul>',
                },
                field_hide_block: false,
            },
        },

        // Spacer
        {
            type: "paragraph--lpp_spacer",
            id: "0cede427-8590-4055-8894-a98489a5a5c9",
            attributes: { field_hide_block: false },
        },

        // Paragraph -- tip_heading (2)
        {
            type: "paragraph--tip_heading",
            id: "a1bac56f-f2ae-4f73-bee5-c9cf3d748d58",
            attributes: {
                field_tip_heading_number: "2",
                field_tip_heading_text: "Nettverket ditt",
                field_hide_block: false,
            },
        },

        // Paragraph -- lpp_html (2)
        {
            type: "paragraph--lpp_html",
            id: "c4b262e9-ed61-4292-83f9-2cd5195862a9",
            attributes: {
                field_lpp_html_content: {
                    processed:
                        "<p>Det finnes jobber som ikke legges ut på nett eller i aviser. Mange bedrifter bruker kontaktene sine for å finne folk. Du kan:</p><ul><li>Fortelle vennene, familien eller naboer at du leter etter jobb. De kan kjenne noen som har en ledig stilling.</li><li>Bli med i grupper på sosiale medier som er knyttet til jobber du er interessert i.</li><li>Bruk nøkkelord på LinkedIn for å finne jobber.</li></ul>",
                },
                field_hide_block: false,
            },
        },

        // Spacer
        {
            type: "paragraph--lpp_spacer",
            id: "7d2648af-55b0-44e1-86e7-bc856b293a40",
            attributes: { field_hide_block: false },
        },

        // Paragraph -- tip_heading (3)
        {
            type: "paragraph--tip_heading",
            id: "bccc2e5d-1711-4fa6-9749-c52a9d78aff8",
            attributes: {
                field_tip_heading_number: "3",
                field_tip_heading_text: "Nettstedet til bedrifter",
                field_hide_block: false,
            },
        },

        // Paragraph -- title_text_image
        {
            type: "paragraph--title_text_image",
            id: "2e6d826c-ba07-42fa-894c-358a739f5116",
            attributes: {
                field_tti_content: {
                    processed:
                        '<p>Se etter ledige stillinger på bedriftens nettsted eller bedriftens sosiale medier.</p><ul><li>Sjekk om bedriften har en nettside som heter «Karriere» eller «Jobb hos oss».</li><li>Bruk søkefunksjonen. Skriv inn ord som "jobb", "stilling" eller "karriere" for å finne utlyste stillinger.</li><li>Sjekk om du kan sende åpen søknad. Noen bedrifter har denne muligheten selv om de ikke har noen utlyste stillinger.</li></ul>',
                },
                field_tti_layout: "img_right",
                field_tti_style: "simple",
                field_tti_title: null,
                field_hide_block: false,
            },
        },

        // Paragraph -- tip_heading (4)
        {
            type: "paragraph--tip_heading",
            id: "4204b237-21cd-4a84-bdb6-d2f717d9ea7f",
            attributes: {
                field_tip_heading_number: "4",
                field_tip_heading_text: "Bemanningsbyrå",
                field_hide_block: false,
            },
        },

        // Paragraph -- lpp_html (4)
        {
            type: "paragraph--lpp_html",
            id: "077571fa-0176-419c-b6d4-464aae966937",
            attributes: {
                field_lpp_html_content: {
                    processed:
                        "<p>Bemanningsbyråer leier ut personell til bedrifter. Du kan:</p><ul><li>Se etter ledige stillinger på nettstedet til bemanningsbyråene.</li><li>Registrer deg hos et bemanningsbyrå. Opprett en bruker, legg inn CV-en din og oppgi hva slags jobb du søker. Da kan de ta kontakt hvis de finner noe som passer.</li></ul>",
                },
                field_hide_block: false,
            },
        },
    ],
};
