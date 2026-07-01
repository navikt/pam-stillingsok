/**
 * ⚠️ FIKTIV DATA — KUN FOR DEMO
 *
 * Dette er konstruert innhold for å demonstrere alle planlagte modultyper.
 * Spekulatibve moduler (paragraph--cta, paragraph--banner, osv.) er basert
 * på beskrivelser og har ukjent API-format.
 *
 * Skal aldri brukes i produksjon.
 */

import type { KomplettParagraph } from "./speculativeTypes";

export const komplettMockData: {
    title: string;
    situations: string[];
    paragraphs: KomplettParagraph[];
} = {
    title: "Komplett moduloversikt (fiktiv demo)",
    situations: ["Jobbsøker", "Nyutdannet og skal søke jobb"],
    paragraphs: [
        // --- BEKREFTEDE TYPER ---

        {
            type: "paragraph--tip_heading",
            id: "komplett-tip-1",
            number: "1",
            text: "Bekreftede modultyper",
        },
        {
            type: "paragraph--lpp_html",
            id: "komplett-html-1",
            html: "<p>Disse modulene er bekreftet mot ekte API-respons fra Karriere-API-et. Feltstruktur og parsing er testet.</p>",
        },
        {
            type: "paragraph--lpp_spacer",
            id: "komplett-spacer-1",
        },
        {
            type: "paragraph--title_text_image",
            id: "komplett-tti-1",
            html: "<p>Title Text Image-blokken støtter <strong>rikt HTML-innhold</strong> og ulike layoutvarianter (bilde til høyre, venstre, eller uten bilde).</p>",
            layout: "img_right",
            title: "Title Text Image",
        },
        {
            type: "paragraph--lpp_spacer",
            id: "komplett-spacer-2",
        },
        {
            type: "paragraph--accordion",
            id: "komplett-accordion-1",
            style: "neutral",
            items: [
                {
                    title: "Hva er JSON:API?",
                    html: "<p>JSON:API er en spesifikasjon for REST-APIer som standardiserer hvordan data hentes og sendes. Drupal bruker det som standard for sitt content API.</p>",
                },
                {
                    title: "Hva er paragraph--accordion_item?",
                    html: "<p>Hvert accordion-panel er en separat ressurs i JSON:API-responsen. De hentes via <code>include=field_innholdsmodul_content.field_accordion_items</code>.</p>",
                },
            ],
        },
        {
            type: "paragraph--lpp_spacer",
            id: "komplett-spacer-3",
        },

        // --- SPEKULATIBVE TYPER ---

        {
            type: "paragraph--tip_heading",
            id: "komplett-tip-2",
            number: "2",
            text: "Spekulatibve modultyper (ukjent API-format)",
        },
        {
            type: "paragraph--lpp_html",
            id: "komplett-html-2",
            html: '<p>Modulene under er basert på beskrivelser. Feltnavn og struktur er <strong>gjettet</strong> — de vil endres når ekte API-dokumentasjon foreligger. Merket med <span style="color:var(--a-surface-danger)">rød badge</span>.</p>',
        },
        {
            type: "paragraph--lpp_spacer",
            id: "komplett-spacer-4",
        },
        {
            type: "paragraph--cta",
            id: "komplett-cta-1",
            title: "Søk etter ledige stillinger",
            description: "Finn jobber som passer deg på Arbeidsplassen.no. Bruk filtre for sted, yrke og arbeidstid.",
            href: "https://arbeidsplassen.nav.no/stillinger",
            linkText: "Gå til stillingsøk",
        },
        {
            type: "paragraph--lpp_spacer",
            id: "komplett-spacer-5",
        },
        {
            type: "paragraph--cta_grid",
            id: "komplett-cta-grid-1",
            heading: "Nyttige ressurser",
            items: [
                {
                    title: "CV-tips",
                    description: "Lær hvordan du skriver en CV som skiller seg ut.",
                    href: "https://arbeidsplassen.nav.no/cv",
                    linkText: "Les CV-tips",
                },
                {
                    title: "Intervjuforberedelse",
                    description: "Forbered deg til jobbintervjuet med våre råd.",
                    href: "https://karriereveiledning.no/intervju",
                    linkText: "Forbered deg",
                },
                {
                    title: "Karriereveiledning",
                    description: "Snakk med en veileder om dine muligheter.",
                    href: "https://karriereveiledning.no",
                    linkText: "Book time",
                },
                {
                    title: "Dagpenger",
                    description: "Sjekk om du har rett til dagpenger mens du søker jobb.",
                    href: "https://www.nav.no/dagpenger",
                    linkText: "Les om dagpenger",
                },
            ],
        },
        {
            type: "paragraph--lpp_spacer",
            id: "komplett-spacer-6",
        },
        {
            type: "paragraph--banner",
            id: "komplett-banner-1",
            title: "Sommerjobb 2025 — søk nå!",
            body: "Vi har hundrevis av sommerjobber for deg som er mellom 18 og 30 år. Søknadsfristen er 1. mars.",
            linkHref: "https://arbeidsplassen.nav.no/sommerjobb",
            linkText: "Se alle sommerjobber",
        },
        {
            type: "paragraph--lpp_spacer",
            id: "komplett-spacer-7",
        },
        {
            type: "paragraph--notice_block",
            id: "komplett-notice-1",
            variant: "info",
            title: "Viktig informasjon",
            body: "Husk å oppdatere CV-en din jevnlig. En oppdatert CV øker sjansen for å bli sett av arbeidsgivere.",
        },
        {
            type: "paragraph--lpp_spacer",
            id: "komplett-spacer-8",
        },
        {
            type: "paragraph--situations_cards",
            id: "komplett-situations-cards-1",
            heading: "Hvilken situasjon passer deg best?",
            items: [
                {
                    title: "Jeg er nyutdannet",
                    description: "Tips og råd for deg som nettopp er ferdig med utdanningen.",
                    href: "/karriere/nyutdannet",
                },
                {
                    title: "Jeg vil bytte jobb",
                    description: "Slik planlegger du en karriereendring steg for steg.",
                    href: "/karriere/bytte-jobb",
                },
                {
                    title: "Jeg er permittert",
                    description: "Hva kan du gjøre mens du er permittert fra jobben?",
                    href: "/karriere/permittert",
                },
            ],
        },
        {
            type: "paragraph--lpp_spacer",
            id: "komplett-spacer-9",
        },
        {
            type: "paragraph--quiz",
            id: "komplett-quiz-1",
            title: "Test kunnskapene dine om jobbsøking",
            questions: [
                {
                    question: "Hva bør du alltid tilpasse til stillingen du søker på?",
                    options: ["CV-en", "Søknadsteksten", "Begge deler", "Ingen av delene"],
                    correctIndex: 2,
                    explanation:
                        "Både CV og søknadstekst bør tilpasses den aktuelle stillingen for best mulig inntrykk.",
                },
                {
                    question: "Hva er et godt tidspunkt å sende en jobbsøknad?",
                    options: [
                        "Rett ved fristen",
                        "Tidlig i søknadsperioden",
                        "Det spiller ingen rolle",
                        "Alltid på mandag morgen",
                    ],
                    correctIndex: 1,
                    explanation:
                        "Søknader som kommer tidlig i perioden blir ofte lest mer grundig før rekrutterere blir overveldet.",
                },
            ],
        },
    ],
};
