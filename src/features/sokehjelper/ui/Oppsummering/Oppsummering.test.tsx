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
    jobbtypes: [],
    steder: [],
    county: null,
    yrker: [],
    fritekst: "",
    aktivtSteg: 4,
};

describe("Oppsummering", () => {
    it("CTA-lenken har riktig href for deltid + Oslo + helse", () => {
        render(
            <Oppsummering
                state={{ ...BASE_STATE, jobbtypes: ["deltid"], steder: ["sted"], county: "OSLO", yrker: ["helse"] }}
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
        render(<Oppsummering state={{ ...BASE_STATE, jobbtypes: ["sommerjobb"] }} onStartPaaNytt={vi.fn()} />);
        expect(screen.getByText("Sommerjobb")).toBeInTheDocument();
    });

    it("viser chips for flere jobbtypes", () => {
        render(
            <Oppsummering state={{ ...BASE_STATE, jobbtypes: ["sommerjobb", "deltid"] }} onStartPaaNytt={vi.fn()} />,
        );
        expect(screen.getByText("Sommerjobb")).toBeInTheDocument();
        expect(screen.getByText("Deltidsjobb")).toBeInTheDocument();
    });

    it("viser chip for fylke når steder=sted og county er satt", () => {
        render(
            <Oppsummering state={{ ...BASE_STATE, steder: ["sted"], county: "VESTLAND" }} onStartPaaNytt={vi.fn()} />,
        );
        expect(screen.getByText("Vestland")).toBeInTheDocument();
    });

    it("viser chip for yrke", () => {
        render(<Oppsummering state={{ ...BASE_STATE, yrker: ["it"] }} onStartPaaNytt={vi.fn()} />);
        expect(screen.getByText("IT og teknologi")).toBeInTheDocument();
    });

    it("viser chips for flere yrker", () => {
        render(<Oppsummering state={{ ...BASE_STATE, yrker: ["it", "helse"] }} onStartPaaNytt={vi.fn()} />);
        expect(screen.getByText("IT og teknologi")).toBeInTheDocument();
        expect(screen.getByText("Helse og omsorg")).toBeInTheDocument();
    });

    it("viser fritekst som chip når yrke=annet", () => {
        render(<Oppsummering state={{ ...BASE_STATE, yrker: ["annet"], fritekst: "kokk" }} onStartPaaNytt={vi.fn()} />);
        expect(screen.getByText("kokk")).toBeInTheDocument();
    });

    it("viser ikke chip for bytte-jobb (ikke et spesifikt søkekriterie)", () => {
        render(<Oppsummering state={{ ...BASE_STATE, jobbtypes: ["bytte-jobb"] }} onStartPaaNytt={vi.fn()} />);
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
