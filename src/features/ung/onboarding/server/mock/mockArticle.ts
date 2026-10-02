import "server-only";
import type { ArticleQuiz, SharedContentArticle } from "@/features/ung/onboarding/domain/article";
import { sanitizeSharedContentHtml } from "@/features/ung/onboarding/server/sanitizeSharedContentHtml.server";

export const MOCK_ARTICLE_ID = "00000000-0000-4000-8000-000000000001";
const MOCK_WEBFORM_ID = "00000000-0000-4000-8000-000000000002";

/**
 * Eksempelartikkel for SHARED_CONTENT_SOURCE=mock. Den har én av hver blokktype, slik at artikkelsida kan
 * styles uten API-et. Innholdet er oppdiktet.
 */
export const mockArticle: SharedContentArticle = {
    id: MOCK_ARTICLE_ID,
    title: "Eksempelartikkel med alle blokktyper",
    intro: "Mockinnhold for å jobbe med artikkelsida når API-et ikke er tilgjengelig.",
    webformId: MOCK_WEBFORM_ID,
    blocks: [
        {
            id: "mock-rich-text",
            type: "rich-text",
            html: sanitizeSharedContentHtml(
                "<p>Dette er vanlig brødtekst med <strong>uthevet tekst</strong> og en <a href='/ung'>lenke</a>.</p><ul><li>Første punkt</li><li>Andre punkt</li></ul>",
            ),
        },
        { id: "mock-heading", type: "heading", number: "1", text: "Nummerert overskrift" },
        {
            id: "mock-accordion",
            type: "accordion",
            items: [
                {
                    id: "mock-accordion-1",
                    title: "Hva er en åpen søknad?",
                    html: sanitizeSharedContentHtml("<p>En søknad du sender uten at det er lyst ut en stilling.</p>"),
                },
                {
                    id: "mock-accordion-2",
                    title: "Hvor lang bør en CV være?",
                    html: sanitizeSharedContentHtml("<p>Ofte holder det med én til to sider.</p>"),
                },
            ],
        },
        { id: "mock-spacer", type: "spacer" },
        {
            id: "mock-title-text-image-box",
            type: "title-text-image",
            title: "Tittel, tekst og bilde i farget boks",
            layout: "right",
            style: "coloured-box",
            html: sanitizeSharedContentHtml("<p>Tekst ved siden av et bilde.</p>"),
            link: { href: "/stillinger", label: "Se ledige stillinger" },
            image: { src: "/images/superrask-soknad.jpg", alt: "Ung person som søker jobb", width: 505, height: 382 },
        },
        {
            id: "mock-title-text-image-simple",
            type: "title-text-image",
            title: "Tittel og tekst uten bilde",
            layout: "left",
            style: "simple",
            html: sanitizeSharedContentHtml("<p>Enkel variant uten bilde og lenke.</p>"),
        },
        {
            id: "mock-video",
            type: "video",
            provider: "vimeo",
            title: "Hvordan finner jeg flere relevante jobber?",
            href: "https://player.vimeo.com/video/1180806925",
        },
    ],
};

export const mockArticleQuiz: ArticleQuiz = {
    questions: [
        {
            id: "mock-quiz-1",
            statement: "Du bør tilpasse søknaden til hver stilling.",
            options: [
                {
                    id: "mock-quiz-1-true",
                    label: "Sant",
                    isCorrect: true,
                    feedbackHtml: sanitizeSharedContentHtml("<p>Riktig. Vis at du har lest stillingsannonsen.</p>"),
                },
                {
                    id: "mock-quiz-1-false",
                    label: "Usant",
                    isCorrect: false,
                    feedbackHtml: sanitizeSharedContentHtml("<p>Feil. En tilpasset søknad skiller seg ut.</p>"),
                },
            ],
        },
        {
            id: "mock-quiz-2",
            statement: "Du må ha jobberfaring for å få en sommerjobb.",
            options: [
                {
                    id: "mock-quiz-2-true",
                    label: "Sant",
                    isCorrect: false,
                    feedbackHtml: sanitizeSharedContentHtml(
                        "<p>Feil. Mange sommerjobber passer for deg uten erfaring.</p>",
                    ),
                },
                {
                    id: "mock-quiz-2-false",
                    label: "Usant",
                    isCorrect: true,
                    feedbackHtml: sanitizeSharedContentHtml(
                        "<p>Riktig. Skolearbeid og fritidsaktiviteter teller også.</p>",
                    ),
                },
            ],
        },
    ],
};
