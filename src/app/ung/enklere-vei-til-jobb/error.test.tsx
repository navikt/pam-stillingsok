import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import OnboardingError from "@/app/ung/enklere-vei-til-jobb/error";

describe("OnboardingError", () => {
    it("henter serverinnholdet på nytt når brukeren prøver igjen", async () => {
        const user = userEvent.setup();
        const reset = vi.fn();

        render(<OnboardingError error={new Error("test")} reset={reset} />);

        await user.click(screen.getByRole("button", { name: "Prøv igjen" }));

        expect(reset).toHaveBeenCalledOnce();
    });
});
