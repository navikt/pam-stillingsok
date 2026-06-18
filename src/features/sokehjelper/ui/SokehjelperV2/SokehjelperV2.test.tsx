import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SokehjelperV2 from "./SokehjelperV2";

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
    useSearchParams: () => new URLSearchParams(""),
    usePathname: () => "/",
}));

vi.mock("@/app/_common/umami", () => ({
    track: vi.fn(),
}));

describe("SokehjelperV2", () => {
    it("viser alle tre seksjoner samtidig", () => {
        render(<SokehjelperV2 />);
        expect(screen.getByRole("heading", { name: "Hvor vil du jobbe?" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Hva er du mest interessert i akkurat nå?" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Hva er du interessert i å jobbe med?" })).toBeInTheDocument();
    });

    it("viser Se ledige jobber-knapp og Hopp over-lenke", () => {
        render(<SokehjelperV2 />);
        expect(screen.getByRole("button", { name: "Se ledige jobber" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Hopp over" })).toHaveAttribute("href", "/stillinger");
    });

    it("Se ledige jobber peker til /stillinger uten params ved ingen valg", () => {
        render(<SokehjelperV2 />);
        expect(screen.getByRole("button", { name: "Se ledige jobber" })).toHaveAttribute("href", "/stillinger");
    });

    it("hjemmekontor-chip vises under select og kan toggles", async () => {
        const user = userEvent.setup();
        render(<SokehjelperV2 />);

        const chip = screen.getByRole("button", { name: "🏡 Fra hjemmekontoret" });
        expect(chip).toBeInTheDocument();
        await user.click(chip);
        expect(chip).toHaveAttribute("aria-pressed", "true");

        await user.click(chip);
        expect(chip).toHaveAttribute("aria-pressed", "false");
    });

    it("select for fylke vises alltid", () => {
        render(<SokehjelperV2 />);
        expect(screen.getByRole("combobox", { name: "Velg fylke" })).toBeInTheDocument();
    });

    it("select har 'Hvor som helst' som første valg", () => {
        render(<SokehjelperV2 />);
        const select = screen.getByRole("combobox", { name: "Velg fylke" });
        expect(select).toHaveValue("");
        expect(screen.getByRole("option", { name: "Hvor som helst" })).toBeInTheDocument();
    });

    it("select for fylke oppdaterer søke-URL", async () => {
        const user = userEvent.setup();
        render(<SokehjelperV2 />);

        await user.selectOptions(screen.getByRole("combobox", { name: "Velg fylke" }), "OSLO");

        expect(screen.getByRole("button", { name: "Se ledige jobber" })).toHaveAttribute(
            "href",
            "/stillinger?county=OSLO",
        );
    });

    it("jobbtype-chip kan velges og oppdaterer søke-URL", async () => {
        const user = userEvent.setup();
        render(<SokehjelperV2 />);

        await user.click(screen.getByRole("button", { name: "🌴 Sommerjobb" }));

        expect(screen.getByRole("button", { name: "Se ledige jobber" })).toHaveAttribute(
            "href",
            "/stillinger?isSummerJob=true",
        );
    });

    it("yrke-chip kan velges og oppdaterer søke-URL", async () => {
        const user = userEvent.setup();
        render(<SokehjelperV2 />);

        await user.click(screen.getByRole("button", { name: "👾 IT og teknologi" }));

        expect(screen.getByRole("button", { name: "Se ledige jobber" })).toHaveAttribute(
            "href",
            "/stillinger?occupationLevel1=IT",
        );
    });

    it("annet-yrke viser fritekstfelt", async () => {
        const user = userEvent.setup();
        render(<SokehjelperV2 />);

        expect(screen.queryByRole("textbox", { name: "Hva vil du jobbe med?" })).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Noe annet (skriv selv)" }));
        expect(screen.getByRole("textbox", { name: "Hva vil du jobbe med?" })).toBeInTheDocument();
    });

    it("fritekst for annet-yrke ryddes når chip fjernes", async () => {
        const user = userEvent.setup();
        render(<SokehjelperV2 />);

        await user.click(screen.getByRole("button", { name: "Noe annet (skriv selv)" }));
        await user.type(screen.getByRole("textbox", { name: "Hva vil du jobbe med?" }), "kokk");
        await user.click(screen.getByRole("button", { name: "Noe annet (skriv selv)" }));

        expect(screen.queryByRole("textbox", { name: "Hva vil du jobbe med?" })).not.toBeInTheDocument();
    });

    it("seksjonen har tilgjengelig navn via aria-labelledby", () => {
        render(<SokehjelperV2 />);
        expect(screen.getByRole("region", { name: "Hvor vil du jobbe?" })).toBeInTheDocument();
    });
});
