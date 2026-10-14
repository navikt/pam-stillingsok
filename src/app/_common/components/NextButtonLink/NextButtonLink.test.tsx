import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextButtonLink } from "@/app/_common/components/NextButtonLink/NextButtonLink";

const track = vi.hoisted(() => vi.fn());
vi.mock("@/app/_common/umami", () => ({ track }));

describe("NextButtonLink", () => {
    beforeEach(() => {
        track.mockClear();
    });

    it("beholder href og sender tracking ved klikk", async () => {
        const user = userEvent.setup();
        render(
            <NextButtonLink
                href="/ung/enklere-vei-til-jobb/artikkel/quiz"
                tracking={[
                    "Klikk - Enklere vei til jobb",
                    {
                        action: "åpne-jobbquiz",
                        location: "resultater",
                        elementId: "jobbquiz",
                        elementLabel: "Prøv jobbquizen",
                        articleId: "quiz",
                    },
                ]}
            >
                Prøv jobbquizen
            </NextButtonLink>,
        );

        const buttonLink = screen.getByRole("button", { name: "Prøv jobbquizen" });
        expect(buttonLink).toHaveAttribute("href", "/ung/enklere-vei-til-jobb/artikkel/quiz");
        buttonLink.addEventListener("click", (event) => event.preventDefault());

        await user.click(buttonLink);

        expect(track).toHaveBeenCalledWith("Klikk - Enklere vei til jobb", {
            action: "åpne-jobbquiz",
            location: "resultater",
            elementId: "jobbquiz",
            elementLabel: "Prøv jobbquizen",
            articleId: "quiz",
        });
    });
});
