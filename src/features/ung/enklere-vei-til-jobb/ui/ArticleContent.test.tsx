import { Heading } from "@navikt/ds-react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import type { ArticleBlock } from "@/features/ung/enklere-vei-til-jobb/domain/article";
import { sanitizeSharedContentArticleHtml } from "@/features/ung/enklere-vei-til-jobb/server/sanitizeSharedContentHtml.server";
import { ArticleContent } from "@/features/ung/enklere-vei-til-jobb/ui/ArticleContent";

const track = vi.hoisted(() => vi.fn());
vi.mock("@/app/_common/umami", () => ({ track }));

const blocks: readonly ArticleBlock[] = [
    { id: "h", type: "heading", number: "1", text: "Finn ut hva du kan tilby", level: "2" },
    { id: "r", type: "rich-text", html: sanitizeSharedContentArticleHtml("<h2>Kom i gang</h2><p>Tekst</p>") },
    {
        id: "acc",
        type: "accordion",
        style: "primary",
        items: [
            { id: "i1", title: "Spørsmål én", html: sanitizeSharedContentArticleHtml("<p>Svar én</p>") },
            { id: "i2", title: "Spørsmål to", html: sanitizeSharedContentArticleHtml("<p>Svar to</p>") },
        ],
    },
    { id: "s", type: "spacer" },
    {
        id: "t",
        type: "title-text-image",
        title: "Karriereveiledning.no",
        headingLevel: "2",
        layout: "left",
        style: "simple",
        html: sanitizeSharedContentArticleHtml("<p>Hjelp</p>"),
        link: { href: "https://karriereveiledning.no", label: "Gå til Karriereveiledning.no" },
        image: {
            src: "https://cms.staging.karriereveiledning.no/sites/default/files/bilde.jpg",
            alt: "Alt-tekst",
            width: 800,
            height: 600,
        },
    },
    {
        id: "v",
        type: "video",
        provider: "vimeo",
        title: "Tips om jobb",
        href: "https://player.vimeo.com/video/1180806925?",
    },
];

describe("ArticleContent", () => {
    beforeEach(() => {
        track.mockClear();
    });

    it("rendrer blokkene med klikk-for-å-laste-video, riktige lenker og uten UU-feil", async () => {
        const { container } = render(
            <main>
                <article>
                    <Heading level="1" size="xlarge">
                        Artikkeltittel
                    </Heading>
                    <ArticleContent blocks={blocks} />
                </article>
            </main>,
        );

        expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
        expect(screen.getByRole("heading", { level: 2, name: "1. Finn ut hva du kan tilby" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 2, name: "Kom i gang" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Gå til Karriereveiledning.no" })).toHaveAttribute(
            "href",
            "https://karriereveiledning.no",
        );
        expect(screen.getByRole("button", { name: "Spill av video: Tips om jobb" })).toBeInTheDocument();
        expect(container.querySelector("iframe")).not.toBeInTheDocument();

        await act(async () => {
            await runAxeTest(container);
        });
    });

    it("laster Vimeo-spilleren først etter klikk", async () => {
        const user = userEvent.setup();
        render(<ArticleContent blocks={blocks} articleSlug="article-test" />);

        await user.click(screen.getByRole("button", { name: "Spill av video: Tips om jobb" }));

        const iframe = screen.getByTitle("Tips om jobb");
        expect(iframe).toHaveAttribute("src", "https://player.vimeo.com/video/1180806925?dnt=1&autoplay=1");
    });

    it("nummererer primary accordion-items", () => {
        render(<ArticleContent blocks={blocks} />);

        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("bruker heading-nivå og valgfrie overskrifter fra Shared Content", () => {
        const headingBlocks: readonly ArticleBlock[] = [
            { id: "tip", type: "heading", text: "Tipsoverskrift", level: "3" },
            {
                id: "accordion",
                type: "accordion",
                style: "primary",
                heading: { text: "Accordion-overskrift", level: "4" },
                items: [
                    {
                        id: "item",
                        title: "Accordion-element",
                        html: sanitizeSharedContentArticleHtml("<p>Innhold</p>"),
                    },
                ],
            },
            {
                id: "tti",
                type: "title-text-image",
                title: "Tittel, tekst og bilde",
                headingLevel: "3",
                layout: "right",
                style: "simple",
            },
            {
                id: "video",
                type: "video",
                provider: "vimeo",
                title: "Videotittel",
                heading: { text: "Videooverskrift", level: "4" },
                href: "https://player.vimeo.com/video/1180806925",
            },
        ];

        render(<ArticleContent blocks={headingBlocks} />);

        expect(screen.getByRole("heading", { level: 3, name: "Tipsoverskrift" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 4, name: "Accordion-overskrift" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 5, name: "Accordion-element" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 3, name: "Tittel, tekst og bilde" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 4, name: "Videooverskrift" })).toBeInTheDocument();
    });
});
