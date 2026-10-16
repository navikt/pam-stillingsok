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

        expect(screen.getByRole("button", { name: "Julejobb" })).toBeInTheDocument();
    });

    it("oppdaterer søket uten duplikat og sporer filterklikket", async () => {
        searchParams = "county=03";
        const user = userEvent.setup();
        render(<PromotedSearchFilters xmasJobFilterVisible />);

        await user.click(screen.getByRole("button", { name: "Julejobb" }));

        expect(routerReplace).toHaveBeenCalledTimes(1);
        const [nextUrl] = routerReplace.mock.calls[0];
        expect(nextUrl).toContain("county=03");
        expect(new URL(nextUrl, "http://localhost").searchParams.getAll("isXmasJob")).toEqual(["true"]);
        expect(track).toHaveBeenCalledWith("Søk - la til filter", {
            filterGroup: "Julejobb",
            filterSource: "prioritert-filter",
        });
    });

    it("skjuler julejobbfilteret når det allerede er aktivt", () => {
        searchParams = "isXmasJob=true";
        const { container } = render(<PromotedSearchFilters xmasJobFilterVisible />);

        expect(screen.queryByRole("button", { name: "Julejobb" })).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
    });

    it("skjuler julejobbfilteret når visningsflagget er false", () => {
        const { container } = render(<PromotedSearchFilters xmasJobFilterVisible={false} />);

        expect(screen.queryByRole("button", { name: "Julejobb" })).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
    });
});
