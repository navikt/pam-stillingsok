import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Sokehjelper from "./Sokehjelper";

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
    useSearchParams: () => new URLSearchParams(""),
    usePathname: () => "/",
}));

vi.mock("@/app/_common/umami", () => ({
    track: vi.fn(),
}));

describe("Sokehjelper", () => {
    it("viser steg 1 med RadioGroup som har tilgjengelig legend", () => {
        render(<Sokehjelper />);
        expect(screen.getByText("Hva slags jobb leter du etter?")).toBeInTheDocument();
        expect(screen.getAllByRole("radio")).toHaveLength(6);
    });

    it("Neste-knapp er deaktivert frem til et valg er gjort", () => {
        render(<Sokehjelper />);
        expect(screen.getByRole("button", { name: "Neste" })).toBeDisabled();
    });

    it("Neste-knapp aktiveres etter valg", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper />);

        await user.click(screen.getByRole("radio", { name: "Deltidsjobb" }));
        expect(screen.getByRole("button", { name: "Neste" })).toBeEnabled();
    });

    it("navigerer til steg 2 etter valg i steg 1", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper />);

        await user.click(screen.getByRole("radio", { name: "Deltidsjobb" }));
        await user.click(screen.getByRole("button", { name: "Neste" }));

        expect(screen.getByText("Hvor vil du jobbe?")).toBeInTheDocument();
    });

    it("Tilbake-knapp er ikke synlig i steg 1", () => {
        render(<Sokehjelper />);
        expect(screen.queryByRole("button", { name: "← Tilbake" })).not.toBeInTheDocument();
    });

    it("Tilbake-knapp er synlig i steg 2", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper />);

        await user.click(screen.getByRole("radio", { name: "Sommerjobb" }));
        await user.click(screen.getByRole("button", { name: "Neste" }));

        expect(screen.getByRole("button", { name: "← Tilbake" })).toBeInTheDocument();
    });

    it("Tilbake-knapp returnerer til forrige steg", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper />);

        await user.click(screen.getByRole("radio", { name: "Sommerjobb" }));
        await user.click(screen.getByRole("button", { name: "Neste" }));
        await user.click(screen.getByRole("button", { name: "← Tilbake" }));

        expect(screen.getByText("Hva slags jobb leter du etter?")).toBeInTheDocument();
    });

    it("seksjonen har et tilgjengelig navn via aria-labelledby", () => {
        render(<Sokehjelper />);
        expect(screen.getByRole("region", { name: "Usikker på hva du skal søke etter?" })).toBeInTheDocument();
    });

    it("aria-live region finnes og beskriver stegnummer", () => {
        render(<Sokehjelper />);
        const liveRegion = document.querySelector("[aria-live='polite']");
        expect(liveRegion).toBeInTheDocument();
        expect(liveRegion?.textContent).toContain("Steg 1 av 4");
    });
});
