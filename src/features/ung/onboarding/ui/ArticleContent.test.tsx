import { Heading } from "@navikt/ds-react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import type { ArticleBlock } from "@/features/ung/onboarding/domain/types";
import { sanitizeSharedContentArticleHtml } from "@/features/ung/onboarding/server/sanitizeSharedContentHtml.server";
import { ArticleContent } from "@/features/ung/onboarding/ui/ArticleContent";

const blocks: readonly ArticleBlock[] = [
    { id: "h", type: "heading", number: "1", text: "Finn ut hva du kan tilby" },
    { id: "r", type: "rich-text", html: sanitizeSharedContentArticleHtml("<h2>Kom i gang</h2><p>Tekst</p>") },
    {
        id: "acc",
        type: "accordion",
        items: [{ id: "i1", title: "Spørsmål én", html: sanitizeSharedContentArticleHtml("<p>Svar én</p>") }],
    },
    { id: "s", type: "spacer" },
    {
        id: "t",
        type: "title-text-image",
        title: "Karriereveiledning.no",
        html: sanitizeSharedContentArticleHtml("<p>Hjelp</p>"),
        link: { href: "https://karriereveiledning.no", label: "Gå til Karriereveiledning.no" },
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
    it("rendrer blokkene uten iframe, med riktige lenker og uten UU-feil", async () => {
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
        expect(screen.getByRole("link", { name: "Tips om jobb" })).toHaveAttribute(
            "href",
            "https://player.vimeo.com/video/1180806925?",
        );
        expect(container.querySelector("iframe")).not.toBeInTheDocument();

        await act(async () => {
            await runAxeTest(container);
        });
    });

    it("åpner accordion med tastatur", async () => {
        const user = userEvent.setup();
        render(<ArticleContent blocks={blocks} />);

        const button = screen.getByRole("button", { name: "Spørsmål én" });
        expect(button).toHaveAttribute("aria-expanded", "false");

        await user.tab();
        expect(button).toHaveFocus();
        await user.keyboard("{Enter}");

        expect(button).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByText("Svar én")).toBeVisible();
    });
});
