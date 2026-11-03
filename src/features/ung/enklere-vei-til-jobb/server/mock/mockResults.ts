import "server-only";
import type { ArticleResultContent } from "@/features/ung/enklere-vei-til-jobb/domain/results";
import {
    MOCK_AGE_UNDER_18,
    MOCK_EXPERIENCE_NONE,
    MOCK_EXPERIENCE_SOME,
    MOCK_GOAL_APPLY,
    MOCK_GOAL_FIND_JOB,
    MOCK_GOAL_INTERVIEW,
} from "@/features/ung/enklere-vei-til-jobb/server/mock/mockOnboardingTaxonomy";

export type MockResultItem = Readonly<{
    /** Vises når brukeren ikke har valgt noe, og alltid ellers. */
    showWithoutAnswers: boolean;
    /** Vises hvis brukeren har valgt minst ett av disse svarene. */
    answerIds: readonly string[];
    content: ArticleResultContent;
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
                answerIds: [MOCK_AGE_UNDER_18, MOCK_GOAL_FIND_JOB],
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
                answerIds: [MOCK_GOAL_FIND_JOB, MOCK_GOAL_APPLY, MOCK_EXPERIENCE_NONE, MOCK_EXPERIENCE_SOME],
                content: {
                    id: "article-ready-to-apply",
                    type: "article",
                    title: "Gjør deg klar til å søke jobb",
                    description: "Tips til hvordan du kan tilpasse CV og søknad til jobben du vil ha.",
                    href: "/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb",
                    image: {
                        src: "/images/ki-soknad-ung.jpg",
                        alt: "",
                        width: 1200,
                        height: 800,
                    },
                },
            },
            {
                showWithoutAnswers: false,
                answerIds: [MOCK_GOAL_INTERVIEW],
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
];
