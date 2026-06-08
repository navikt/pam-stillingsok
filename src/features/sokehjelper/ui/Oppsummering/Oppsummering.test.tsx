import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { WizardState } from "@/features/sokehjelper/model/sokehjelperTypes";
import Oppsummering from "./Oppsummering";

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
    useSearchParams: () => new URLSearchParams(""),
    usePathname: () => "/",
}));

vi.mock("@/app/_common/umami", () => ({
    track: vi.fn(),
}));

const BASE_STATE: WizardState = {
    jobbtype: null,
    sted: null,
    county: null,
    yrke: null,
    fritekst: "",
    aktivtSteg: 4,
};

describe("Oppsummering", () => {
    it("CTA-lenken har riktig href for deltid + Oslo + helse", () => {
        render(
            <Oppsummering
                state={{ ...BASE_STATE, jobbtype: "deltid", sted: "sted", county: "OSLO", yrke: "helse" }}
                onStartPaaNytt={vi.fn()}
            />,
        );

        const cta = screen.getByRole("button", { name: "Se ledige jobber" });
        expect(cta).toHaveAttribute("href", "/stillinger?extent=Deltid&county=OSLO&occupationLevel1=Helse+og+sosial");
    });

    it("CTA-lenken peker til /stillinger uten params for ingen valg", () => {
        render(<Oppsummering state={BASE_STATE} onStartPaaNytt={vi.fn()} />);
        expect(screen.getByRole("button", { name: "Se ledige jobber" })).toHaveAttribute("href", "/stillinger");
    });

    it("viser chip for jobbtype når valgt", () => {
        render(<Oppsummering state={{ ...BASE_STATE, jobbtype: "sommerjobb" }} onStartPaaNytt={vi.fn()} />);
        expect(screen.getByText("Sommerjobb")).toBeInTheDocument();
    });

    it("viser chip for fylke når sted=sted og county er satt", () => {
        render(<Oppsummering state={{ ...BASE_STATE, sted: "sted", county: "VESTLAND" }} onStartPaaNytt={vi.fn()} />);
        expect(screen.getByText("Vestland")).toBeInTheDocument();
    });

    it("viser chip for yrke", () => {
        render(<Oppsummering state={{ ...BASE_STATE, yrke: "it" }} onStartPaaNytt={vi.fn()} />);
        expect(screen.getByText("IT og teknologi")).toBeInTheDocument();
    });

    it("viser fritekst som chip når yrke=annet", () => {
        render(<Oppsummering state={{ ...BASE_STATE, yrke: "annet", fritekst: "kokk" }} onStartPaaNytt={vi.fn()} />);
        expect(screen.getByText("kokk")).toBeInTheDocument();
    });

    it("viser ikke chip for usikker-jobbtype", () => {
        render(<Oppsummering state={{ ...BASE_STATE, jobbtype: "usikker" }} onStartPaaNytt={vi.fn()} />);
        expect(screen.queryByText("Jeg er usikker")).not.toBeInTheDocument();
    });

    it("CTA-lenke er tilgjengelig med rolle 'button' og beskrivende navn", () => {
        render(<Oppsummering state={BASE_STATE} onStartPaaNytt={vi.fn()} />);
        expect(screen.getByRole("button", { name: "Se ledige jobber" })).toBeInTheDocument();
    });

    it("Start på nytt-knapp kaller onStartPaaNytt", async () => {
        const onStartPaaNytt = vi.fn();
        const { getByRole } = render(<Oppsummering state={BASE_STATE} onStartPaaNytt={onStartPaaNytt} />);
        getByRole("button", { name: "Start på nytt" }).click();
        expect(onStartPaaNytt).toHaveBeenCalledOnce();
    });
});
