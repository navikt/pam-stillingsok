import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import OnboardingError from "@/app/ung/enklere-vei-til-jobb/error";

const track = vi.hoisted(() => vi.fn());
vi.mock("@/app/_common/umami", async (importOriginal) => ({
    ...(await importOriginal<typeof import("@/app/_common/umami")>()),
    track,
}));

describe("OnboardingError", () => {
    it("tracker før den henter serverinnholdet på nytt", async () => {
        const user = userEvent.setup();
        const reset = vi.fn();

        render(<OnboardingError error={new Error("test")} reset={reset} />);

        await user.click(screen.getByRole("button", { name: "Prøv igjen" }));

        expect(track).toHaveBeenCalledWith("Klikk - Enklere vei til jobb", {
            action: "prøv-igjen",
            location: "feilside",
            elementId: "prøv-igjen",
            elementLabel: "Prøv igjen",
        });
        expect(reset).toHaveBeenCalledOnce();
    });
});
