import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Season from "./Season";

const routerReplace = vi.fn();
const routerPush = vi.fn();
let searchParams = "";
const { track } = vi.hoisted(() => ({
    track: vi.fn(),
}));

vi.mock("@/app/_common/umami", () => ({ track }));
vi.mock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams(searchParams),
    useRouter: () => ({ replace: routerReplace, push: routerPush }),
    usePathname: () => "/stillinger",
}));

const emptySeasonCounts = {
    initialSummerJobValues: [],
    updatedSummerJobValues: [],
    initialXmasJobValues: [],
    updatedXmasJobValues: [],
};

beforeEach(() => {
    searchParams = "";
    routerReplace.mockClear();
    routerPush.mockClear();
    track.mockClear();
});

describe("Season", () => {
    it("viser Julejobb med teller 0 når julejobbaggregatene mangler", () => {
        render(<Season initialSummerJobValues={[]} updatedSummerJobValues={[]} />);

        expect(screen.getByRole("checkbox", { name: "Julejobb (0)" })).toBeInTheDocument();
    });

    it("viser begge sesongvalg med teller 0 når aggregatene mangler", () => {
        render(<Season {...emptySeasonCounts} />);

        expect(screen.getByRole("checkbox", { name: "Sommerjobb (0)" })).toBeInTheDocument();
        expect(screen.getByRole("checkbox", { name: "Julejobb (0)" })).toBeInTheDocument();
    });

    it("viser begge sesongvalg som valgt når begge parametere er aktive", () => {
        searchParams = "isSummerJob=true&isXmasJob=true";
        render(<Season {...emptySeasonCounts} />);

        expect(screen.getByRole("checkbox", { name: "Sommerjobb (0)" })).toBeChecked();
        expect(screen.getByRole("checkbox", { name: "Julejobb (0)" })).toBeChecked();
    });

    it.each([
        ["Sommerjobb (0)", "isSummerJob", "Sommerjobb"],
        ["Julejobb (0)", "isXmasJob", "Julejobb"],
    ])("legger til riktig %s-filter med verdien true og logger hendelsen", async (label, param, filterGroup) => {
        const user = userEvent.setup();
        render(<Season {...emptySeasonCounts} />);

        await user.click(screen.getByRole("checkbox", { name: label }));

        expect(routerReplace).toHaveBeenCalledTimes(1);
        const [nextUrl] = routerReplace.mock.calls[0];
        expect(new URL(nextUrl, "http://localhost").searchParams.get(param)).toBe("true");
        expect(track).toHaveBeenCalledWith("Søk - la til filter", { filterGroup });
    });

    it.each([
        ["Sommerjobb (0)", "isSummerJob"],
        ["Julejobb (0)", "isXmasJob"],
    ])("fjerner bare %s-filteret uten å logge en add-hendelse", async (label, param) => {
        searchParams = `q=utvikler&${param}=true`;
        const user = userEvent.setup();
        render(<Season {...emptySeasonCounts} />);

        await user.click(screen.getByRole("checkbox", { name: label }));

        expect(routerReplace).toHaveBeenCalledTimes(1);
        const [nextUrl] = routerReplace.mock.calls[0];
        const nextSearchParams = new URL(nextUrl, "http://localhost").searchParams;
        expect(nextSearchParams.has(param)).toBe(false);
        expect(nextSearchParams.get("q")).toBe("utvikler");
        expect(track).not.toHaveBeenCalled();
    });
});
