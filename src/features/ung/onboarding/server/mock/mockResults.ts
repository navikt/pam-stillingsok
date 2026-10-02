import "server-only";
import type { ResultContent } from "@/features/ung/onboarding/domain/results";
import { sanitizeSharedContentHtml } from "@/features/ung/onboarding/server/sanitizeSharedContentHtml.server";

export type MockResultItem = Readonly<{
    /** Vises når brukeren ikke har valgt noe, og alltid ellers. */
    showWithoutAnswers: boolean;
    /** Vises hvis brukeren har valgt minst ett av disse svarene. */
    answerIds: readonly string[];
    content: ResultContent;
}>;

export type MockResultSection = Readonly<{
    id: string;
    title: string;
    items: readonly MockResultItem[];
}>;

/** Resultatinnhold for SHARED_CONTENT_SOURCE=mock. Live-modus henter artiklene fra API-et i stedet. */
export const mockResultSections: readonly MockResultSection[] = [
    {
        id: "section-recommended",
        title: "Anbefalt for deg",
        items: [
            {
                showWithoutAnswers: false,
                answerIds: ["age-under-18", "goal-find-job"],
                content: {
                    id: "article-under-18",
                    type: "article",
                    title: "Finn jobben for deg under 18 år",
                    description: "Se ledige stillinger du kan søke på selv om du er under 18 år.",
                    href: "/stillinger?under18=true&v=5",
                },
            },
            {
                showWithoutAnswers: true,
                answerIds: ["goal-find-job", "goal-apply", "situation-no-experience", "situation-some-experience"],
                content: {
                    id: "article-ready-to-apply",
                    type: "article",
                    title: "Gjør deg klar til å søke jobb",
                    description: "Tips til hvordan du kan tilpasse CV og søknad til jobben du vil ha.",
                    href: "/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb",
                },
            },
            {
                showWithoutAnswers: false,
                answerIds: ["goal-interview"],
                content: {
                    id: "article-interview",
                    type: "article",
                    title: "Slik forbereder du deg til intervju",
                    description: "En enkel oversikt over hva du kan gjøre før, under og etter intervjuet.",
                    href: "/ung/artikler/far-du-avslag-pa-jobbsoknader-dette-kan-du-gjore",
                },
            },
        ],
    },
    {
        id: "section-questions",
        title: "Spørsmål tilpasset din situasjon",
        items: [
            {
                showWithoutAnswers: false,
                answerIds: ["age-under-18"],
                content: {
                    id: "faq-under-18",
                    type: "faq",
                    question: "Hvilke jobber kan jeg få under 18?",
                    blocks: [
                        {
                            id: "answer-video-under-18",
                            type: "video",
                            provider: "qbrick",
                            mediaId: "b87f69fe-5b28-40e6-8446-6e08c8beb3d5",
                            title: "5 tips til deg som skal søke sommerjobb",
                            duration: "1:52",
                            thumbnail: {
                                src: "/images/video-thumbnail-sommerjobb-tips.jpeg",
                                alt: "Ung veileder som gir tips om sommerjobb",
                                width: 1080,
                                height: 1920,
                            },
                        },
                        {
                            id: "answer-html-under-18",
                            type: "html",
                            html: sanitizeSharedContentHtml(
                                "<p>Er du under 18 år, kan du blant annet jobbe i butikk, restaurant eller på lager. Arbeidsgiveren må følge egne regler for arbeidstid og arbeidsoppgaver.</p>",
                            ),
                        },
                        {
                            id: "answer-link-under-18",
                            type: "link",
                            href: "/stillinger?under18=true&v=5",
                            label: "Se jobber for deg under 18 år",
                        },
                        {
                            id: "answer-card-under-18",
                            type: "related-card",
                            href: "https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/barn-og-ungdom-i-arbeid/",
                            title: "Regler for arbeid under 18 år",
                            description: "Les om arbeidstid og hvilke arbeidsoppgaver du kan ha.",
                            source: "Arbeidstilsynet",
                        },
                    ],
                },
            },
            {
                showWithoutAnswers: true,
                answerIds: [],
                content: {
                    id: "faq-summer-jobs",
                    type: "faq",
                    question: "Hvordan finner jeg sommerjobber?",
                    blocks: [
                        {
                            id: "answer-image-summer-jobs",
                            type: "image",
                            image: {
                                src: "/images/superrask-soknad.jpg",
                                alt: "Ung person som søker jobb",
                                width: 505,
                                height: 382,
                            },
                        },
                        {
                            id: "answer-html-summer-jobs",
                            type: "html",
                            html: sanitizeSharedContentHtml(
                                "<p>Start tidlig, men fortsett å se etter nye annonser gjennom våren. Mange arbeidsgivere publiserer sommerjobber på ulike tidspunkt.</p>",
                            ),
                        },
                    ],
                },
            },
            {
                showWithoutAnswers: true,
                answerIds: [],
                content: {
                    id: "faq-apprenticeship",
                    type: "faq",
                    question: "Hva er en lærlingplass, og hvordan søker jeg?",
                    blocks: [
                        {
                            id: "faq-apprenticeship-html",
                            type: "html",
                            html: sanitizeSharedContentHtml(
                                "<p>En lærlingplass kombinerer opplæring med arbeid i en bedrift. Se etter ledige lærlingplasser og les hvilke fag bedriften tilbyr.</p>",
                            ),
                        },
                    ],
                },
            },
            {
                showWithoutAnswers: false,
                answerIds: ["goal-rights"],
                content: {
                    id: "faq-rights",
                    type: "faq",
                    question: "Hvilke rettigheter har jeg som ung arbeidstaker?",
                    blocks: [
                        {
                            id: "faq-rights-html",
                            type: "html",
                            html: sanitizeSharedContentHtml(
                                '<p>Du har krav på skriftlig arbeidsavtale og et trygt arbeidsmiljø. Les mer om rettigheter i arbeidslivet på <a href="https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/barn-og-ungdom-i-arbeid/">Arbeidstilsynets nettsider</a>.</p>',
                            ),
                        },
                    ],
                },
            },
            {
                showWithoutAnswers: false,
                answerIds: ["goal-support"],
                content: {
                    id: "faq-support",
                    type: "faq",
                    question: "Hvor kan jeg få hjelp til å søke jobb?",
                    blocks: [
                        {
                            id: "faq-support-html",
                            type: "html",
                            html: sanitizeSharedContentHtml(
                                "<p>Du kan få hjelp av noen du stoler på eller kontakte Nav for veiledning. Start med å samle spørsmålene du vil ha svar på.</p>",
                            ),
                        },
                    ],
                },
            },
            {
                showWithoutAnswers: true,
                answerIds: [],
                content: {
                    id: "faq-general",
                    type: "faq",
                    question: "Hvordan kommer jeg i gang?",
                    blocks: [
                        {
                            id: "faq-general-html",
                            type: "html",
                            html: sanitizeSharedContentHtml(
                                "<p>Velg ett lite steg først. Finn en jobb du er nysgjerrig på, og les hva arbeidsgiveren ser etter.</p>",
                            ),
                        },
                    ],
                },
            },
            {
                showWithoutAnswers: true,
                answerIds: [],
                content: {
                    id: "faq-cv",
                    type: "faq",
                    question: "Hvordan tilpasser jeg CV og søknad til stillingen?",
                    blocks: [
                        {
                            id: "faq-cv-html",
                            type: "html",
                            html: sanitizeSharedContentHtml(
                                "<p>Trekk fram erfaring og egenskaper som passer til arbeidsoppgavene. Bruk ord fra stillingsannonsen når de beskriver det du kan.</p>",
                            ),
                        },
                    ],
                },
            },
            {
                showWithoutAnswers: true,
                answerIds: [],
                content: {
                    id: "faq-find-jobs",
                    type: "faq",
                    question: "Hvor finner jeg relevante stillinger å søke på?",
                    blocks: [
                        {
                            id: "answer-html-find-jobs",
                            type: "html",
                            html: sanitizeSharedContentHtml(
                                "<p>Bruk søket på arbeidsplassen.no og juster sted, arbeidstid og erfaring. Lagre søket hvis du vil følge med på nye stillinger.</p>",
                            ),
                        },
                        {
                            id: "answer-video-find-jobs",
                            type: "video",
                            provider: "vimeo",
                            href: "https://player.vimeo.com/video/1180806925?",
                            title: "Hvordan finner jeg flere relevante jobber?",
                        },
                    ],
                },
            },
        ],
    },
];
