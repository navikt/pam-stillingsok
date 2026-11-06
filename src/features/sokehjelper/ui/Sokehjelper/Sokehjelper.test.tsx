import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { track } from "@/app/_common/umami";
import Sokehjelper from "./Sokehjelper";

const LOCATIONS: readonly SearchLocation[] = [
    { key: "OSLO", label: "Oslo", code: "03", municipals: [{ key: "OSLO.OSLO", label: "Oslo", code: "0301" }] },
    {
        key: "TROMS",
        label: "Troms",
        code: "55",
        municipals: [{ key: "TROMS.TROMSØ", label: "Tromsø", code: "5501" }],
    },
];

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
    useSearchParams: () => new URLSearchParams(""),
    usePathname: () => "/",
}));

vi.mock("@/app/_common/umami", () => ({
    track: vi.fn(),
}));

async function openInteresser(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole("button", { name: "Vis mer" }));
}

describe("Sokehjelper", () => {
    it("viser alle tre seksjoner samtidig", () => {
        render(<Sokehjelper />);
        expect(screen.getByRole("heading", { name: "Finn en jobb som passer deg" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Hva ser du etter?" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Velg hva du vil jobbe med" })).toBeInTheDocument();
    });

    it("viser Se ledige jobber-knapp", () => {
        render(<Sokehjelper />);
        expect(screen.getByRole("button", { name: "Se alle ledige jobber" })).toBeInTheDocument();
    });

    it("Se alle ledige jobber peker til /stillinger uten params ved ingen valg", () => {
        render(<Sokehjelper />);
        expect(screen.getByRole("button", { name: "Se alle ledige jobber" })).toHaveAttribute(
            "href",
            "/stillinger?kilde=sokehjelper",
        );
    });

    it("hjemmekontor-chip vises blant jobbtypene og kan toggles", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper />);

        const chip = screen.getByRole("button", { name: "🏡 Hjemmekontor" });
        expect(chip).toBeInTheDocument();
        await user.click(chip);
        expect(chip).toHaveAttribute("aria-pressed", "true");

        await user.click(chip);
        expect(chip).toHaveAttribute("aria-pressed", "false");
    });

    it("combobox for sted vises alltid", () => {
        render(<Sokehjelper />);
        expect(screen.getByRole("combobox", { name: "Hvor vil du jobbe?" })).toBeInTheDocument();
    });

    it("tomt felt viser fylker, ikke kommuner", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper locations={LOCATIONS} />);

        await user.click(screen.getByRole("combobox", { name: "Hvor vil du jobbe?" }));

        expect(screen.getByRole("option", { name: "Troms (fylke)" })).toBeInTheDocument();
        expect(screen.queryByRole("option", { name: "Tromsø (kommune)" })).not.toBeInTheDocument();
    });

    it("fallback uten locations lister fylkene", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper />);

        await user.click(screen.getByRole("combobox", { name: "Hvor vil du jobbe?" }));

        expect(screen.getAllByRole("option")).toHaveLength(16);
    });

    it("valg av fylke oppdaterer søke-URL", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper locations={LOCATIONS} />);

        await user.click(screen.getByRole("combobox", { name: "Hvor vil du jobbe?" }));
        await user.click(screen.getByRole("option", { name: "Troms (fylke)" }));

        expect(screen.getByRole("button", { name: "Se jobber som passer" })).toHaveAttribute(
            "href",
            "/stillinger?county=TROMS&kilde=sokehjelper",
        );
    });

    it("valg av kommune gir både county og municipal", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper locations={LOCATIONS} />);

        await user.type(screen.getByRole("combobox", { name: "Hvor vil du jobbe?" }), "tromsø");
        await user.click(screen.getByRole("option", { name: "Tromsø (kommune)" }));

        const href = screen.getByRole("button", { name: "Se jobber som passer" }).getAttribute("href") ?? "";
        const params = new URL(href, "http://x").searchParams;
        expect(params.get("county")).toBe("TROMS");
        expect(params.get("municipal")).toBe("TROMS.TROMSØ");
        expect(track).toHaveBeenCalledWith("Valg - Søkehjelper", {
            group: "sted",
            valg: "TROMS.TROMSØ",
            selected: true,
        });
    });

    it("Oslo gir bare county", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper locations={LOCATIONS} />);

        await user.click(screen.getByRole("combobox", { name: "Hvor vil du jobbe?" }));
        await user.click(screen.getByRole("option", { name: "Oslo" }));

        expect(screen.getByRole("button", { name: "Se jobber som passer" })).toHaveAttribute(
            "href",
            "/stillinger?county=OSLO&kilde=sokehjelper",
        );
    });

    it("Hvor som helst er valgt som standard og fjerner valgt sted", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper locations={LOCATIONS} />);
        const combobox = screen.getByRole("combobox", { name: "Hvor vil du jobbe?" });
        expect(screen.getAllByText("Hvor som helst").length).toBeGreaterThan(0);

        await user.click(combobox);
        await user.click(screen.getByRole("option", { name: "Troms (fylke)" }));
        await user.click(combobox);
        await user.click(screen.getByRole("option", { name: "Hvor som helst" }));

        expect(screen.getByRole("button", { name: "Se alle ledige jobber" })).toHaveAttribute(
            "href",
            "/stillinger?kilde=sokehjelper",
        );
        expect(track).toHaveBeenCalledWith("Valg - Søkehjelper", { group: "sted", valg: "TROMS", selected: false });
    });

    it("jobbtype-chip kan velges og oppdaterer søke-URL", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper />);

        await user.click(screen.getByRole("button", { name: "🎄 Julejobb" }));

        expect(screen.getByRole("button", { name: "Se jobber som passer" })).toHaveAttribute(
            "href",
            "/stillinger?isXmasJob=true&kilde=sokehjelper",
        );
    });

    it("interesse-kortet bytter tittel når det åpnes", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper />);

        await openInteresser(user);

        expect(screen.getByRole("heading", { name: "Skjul interesser" })).toBeInTheDocument();
        expect(screen.getByText("Hva vil du jobbe med?")).toBeInTheDocument();
    });

    it("yrke-chip kan velges og oppdaterer søke-URL", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper />);
        await openInteresser(user);

        await user.click(screen.getByRole("button", { name: "👾 IT og teknologi" }));

        expect(screen.getByRole("button", { name: "Se jobber som passer" })).toHaveAttribute(
            "href",
            "/stillinger?occupationLevel1=IT&kilde=sokehjelper",
        );
    });

    it("annet-yrke viser fritekstfelt", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper />);
        await openInteresser(user);

        expect(screen.queryByRole("textbox", { name: "Skriv hva du vil jobbe med" })).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Noe annet (skriv selv)" }));
        expect(screen.getByRole("textbox", { name: "Skriv hva du vil jobbe med" })).toBeInTheDocument();
    });

    it("fritekst for annet-yrke ryddes når chip fjernes", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper />);
        await openInteresser(user);

        await user.click(screen.getByRole("button", { name: "Noe annet (skriv selv)" }));
        await user.type(screen.getByRole("textbox", { name: "Skriv hva du vil jobbe med" }), "kokk");
        await user.click(screen.getByRole("button", { name: "Noe annet (skriv selv)" }));

        expect(screen.queryByRole("textbox", { name: "Skriv hva du vil jobbe med" })).not.toBeInTheDocument();
    });

    it("seksjonen har tilgjengelig navn via aria-labelledby", () => {
        render(<Sokehjelper />);
        expect(screen.getByRole("region", { name: "Finn en jobb som passer deg" })).toBeInTheDocument();
    });

    it("sporer valg og fjerning, og søkeklikk med antallValg", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper />);

        const chip = screen.getByRole("button", { name: "🏡 Hjemmekontor" });
        await user.click(chip);
        await user.click(chip);
        expect(track).toHaveBeenCalledWith("Valg - Søkehjelper", {
            group: "ser-etter",
            valg: "hjemmekontor",
            selected: true,
        });
        expect(track).toHaveBeenCalledWith("Valg - Søkehjelper", {
            group: "ser-etter",
            valg: "hjemmekontor",
            selected: false,
        });

        // jsdom kan ikke navigere. Stopp standardhandlingen slik at klikket ikke gir "Not implemented: navigation".
        const sokLenke = screen.getByRole("button", { name: "Se alle ledige jobber" });
        sokLenke.addEventListener("click", (event) => event.preventDefault());
        await user.click(sokLenke);
        expect(track).toHaveBeenCalledWith(
            "Søkehjelper - klikket se ledige jobber",
            expect.objectContaining({ antallValg: 0, hjemmekontor: false }),
        );
    });

    it("viser feil og utelater fritekst fra søket når den ser ut som e-post", async () => {
        const user = userEvent.setup();
        render(<Sokehjelper />);
        await openInteresser(user);

        await user.click(screen.getByRole("button", { name: "Noe annet (skriv selv)" }));
        await user.type(screen.getByRole("textbox", { name: "Skriv hva du vil jobbe med" }), "ola@nav.no");

        expect(screen.getByText(/kan inneholde personopplysninger/)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Se (alle ledige jobber|jobber som passer)/ }).getAttribute("href"),
        ).not.toContain("ola");
    });
});
