import { Heading } from "@navikt/ds-react";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import type { ArticleBlock } from "@/features/ung/onboarding/domain/article";
import { sanitizeSharedContentArticleHtml } from "@/features/ung/onboarding/server/sanitizeSharedContentHtml.server";
import { ArticleContent } from "@/features/ung/onboarding/ui/ArticleContent";

const blocks: readonly ArticleBlock[] = [
    { id: "h", type: "heading", number: "1", text: "Finn ut hva du kan tilby" },
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
        render(<ArticleContent blocks={blocks} />);

        await user.click(screen.getByRole("button", { name: "Spill av video: Tips om jobb" }));

        const iframe = screen.getByTitle("Tips om jobb");
        expect(iframe).toHaveAttribute("src", "https://player.vimeo.com/video/1180806925?dnt=1&autoplay=1");
    });

    it("åpner lukkede accordion-items med tastatur", async () => {
        const user = userEvent.setup();
        render(<ArticleContent blocks={blocks} />);

        const first = within(screen.getByRole("region", { name: "Spørsmål én" })).getByRole("button");
        const second = within(screen.getByRole("region", { name: "Spørsmål to" })).getByRole("button");
        expect(first).toHaveAttribute("aria-expanded", "false");
        expect(second).toHaveAttribute("aria-expanded", "false");

        second.focus();
        expect(second).toHaveFocus();
        await user.keyboard("{Enter}");

        expect(second).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByText("Svar to")).toBeVisible();
    });

    it("grupperer en secondary accordion med overskriften rett foran i en navngitt kontrastseksjon", async () => {
        const secondaryBlocks: readonly ArticleBlock[] = [
            { id: "faq-heading", type: "heading", text: "Vanlige spørsmål" },
            {
                id: "faq-acc",
                type: "accordion",
                style: "secondary",
                items: [
                    { id: "f1", title: "Første spørsmål", html: sanitizeSharedContentArticleHtml("<p>Svar én</p>") },
                    { id: "f2", title: "Andre spørsmål", html: sanitizeSharedContentArticleHtml("<p>Svar to</p>") },
                ],
            },
        ];
        const { container } = render(<ArticleContent blocks={secondaryBlocks} />);

        const section = screen.getByRole("region", { name: "Vanlige spørsmål" });
        const firstCard = screen.getByRole("region", { name: "Første spørsmål" });
        expect(section).toContainElement(firstCard);

        await act(async () => {
            await runAxeTest(container);
        });
    });
});
