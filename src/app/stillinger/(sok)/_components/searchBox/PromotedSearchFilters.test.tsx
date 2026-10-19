import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PromotedSearchFilters from "./PromotedSearchFilters";

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

beforeEach(() => {
    searchParams = "";
    routerReplace.mockClear();
    routerPush.mockClear();
    track.mockClear();
});

describe("PromotedSearchFilters", () => {
    it("viser julejobbfilteret selv om andre filtre er aktive", () => {
        searchParams = "county=03";
        render(<PromotedSearchFilters xmasJobFilterVisible />);

        expect(screen.getByRole("button", { name: "Legg til filteret Julejobb" })).toBeInTheDocument();
    });

    it("oppdaterer søket uten duplikat og sporer filterklikket", async () => {
        searchParams = "county=03";
        const user = userEvent.setup();
        render(<PromotedSearchFilters xmasJobFilterVisible />);

        await user.click(screen.getByRole("button", { name: "Legg til filteret Julejobb" }));

        expect(routerReplace).toHaveBeenCalledTimes(1);
        const [nextUrl] = routerReplace.mock.calls[0];
        expect(nextUrl).toContain("county=03");
        expect(new URL(nextUrl, "http://localhost").searchParams.getAll("isXmasJob")).toEqual(["true"]);
        expect(track).toHaveBeenCalledWith("Søk - la til filter", {
            filterGroup: "Julejobb",
            filterSource: "prioritert-filter",
        });
    });

    it("flytter fokus til søkefeltet når Julejobb aktiveres med tastaturet", async () => {
        const user = userEvent.setup();
        const { rerender } = render(
            <>
                <input aria-label="Sted, yrke eller søkeord" className="search-combobox-input" />
                <PromotedSearchFilters xmasJobFilterVisible />
            </>,
        );

        const button = screen.getByRole("button", { name: "Legg til filteret Julejobb" });
        await user.tab();
        await user.tab();
        expect(button).toHaveFocus();

        await user.keyboard("{Enter}");
        searchParams = "isXmasJob=true";
        rerender(
            <>
                <input aria-label="Sted, yrke eller søkeord" className="search-combobox-input" />
                <PromotedSearchFilters xmasJobFilterVisible />
            </>,
        );

        expect(screen.queryByRole("button", { name: "Legg til filteret Julejobb" })).not.toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Sted, yrke eller søkeord" })).toHaveFocus();
    });

    it("skjuler julejobbfilteret når det allerede er aktivt", () => {
        searchParams = "isXmasJob=true";
        const { container } = render(<PromotedSearchFilters xmasJobFilterVisible />);

        expect(screen.queryByRole("button", { name: "Legg til filteret Julejobb" })).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
    });

    it("skjuler julejobbfilteret når visningsflagget er false", () => {
        const { container } = render(<PromotedSearchFilters xmasJobFilterVisible={false} />);

        expect(screen.queryByRole("button", { name: "Legg til filteret Julejobb" })).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
    });
});
