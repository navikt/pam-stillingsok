import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import type { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import FiltersMobile from "./FiltersMobile";

const { track, routerReplace } = vi.hoisted(() => ({
    track: vi.fn(),
    routerReplace: vi.fn(),
}));

vi.mock("@/app/_common/umami", () => ({ track }));

vi.mock("next/navigation", () => {
    return {
        useSearchParams: () => new URLSearchParams(""),
        useRouter: () => ({ replace: routerReplace, push: vi.fn() }),
        usePathname: () => "/stillinger",
    };
});

function buildAggregations(): FilterAggregations {
    return {
        occupationFirstLevels: [],
        published: [],
        sector: [],
        engagementTypes: [],
        extent: [],
        education: [],
        workLanguage: [],
        remote: [],
        needDriversLicense: [],
        experience: [],
        under18: [],
        summerJob: [{ key: "true", count: 12 }],
        xmasJob: [{ key: "true", count: 3 }],
        hasSuperraskSoknad: [],
        publishedTotalCount: 0,
        totalInternational: 0,
        nationalCountMap: {},
        internationalCountMap: {},
    };
}

function buildSearchResult(): SearchResult {
    return {
        ads: [],
        aggregations: buildAggregations(),
        totalAds: 42,
        totalPositions: 42,
    };
}

function renderFiltersMobile() {
    return render(
        <FiltersMobile
            searchResult={buildSearchResult()}
            aggregations={buildAggregations()}
            locations={[]}
            postcodes={[]}
            errors={[]}
        />,
    );
}

describe("FiltersMobile", () => {
    it("åpner filterdialogen når filterknappen trykkes", async () => {
        const user = userEvent.setup();
        renderFiltersMobile();

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Filter" }));

        expect(track).toHaveBeenCalledWith("Klikk - Vis filtre");
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Filtre", level: 1 })).toBeInTheDocument();
    });

    it("skjuler dialogen ved lukking, og starter på filteroversikten ved gjenåpning", async () => {
        const user = userEvent.setup();
        renderFiltersMobile();

        await user.click(screen.getByRole("button", { name: "Filter" }));
        await user.click(screen.getByRole("button", { name: "Publisert" }));

        expect(screen.getByRole("heading", { name: "Publisert", level: 1 })).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /Vis (\d+ )?treff/ }));

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Filter" }));

        expect(screen.getByRole("heading", { name: "Filtre", level: 1 })).toBeInTheDocument();
    });

    it("viser sesongfiltrene og oppdaterer søket når julejobb velges", async () => {
        const user = userEvent.setup();
        renderFiltersMobile();

        await user.click(screen.getByRole("button", { name: "Filter" }));
        expect(screen.queryByRole("button", { name: /Sommerjobb/ })).not.toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "Sesong" }));

        const summerJobCheckbox = screen.getByRole("checkbox", { name: "Sommerjobb (12)" });
        const xmasJobCheckbox = screen.getByRole("checkbox", { name: "Julejobb (3)" });
        expect(summerJobCheckbox).toBeInTheDocument();
        expect(xmasJobCheckbox).toBeInTheDocument();
        expect(summerJobCheckbox).not.toBeChecked();
        expect(xmasJobCheckbox).not.toBeChecked();

        await user.click(xmasJobCheckbox);

        expect(routerReplace).toHaveBeenCalledTimes(1);
        expect(routerReplace.mock.calls[0][0]).toContain(`${QueryNames.IS_XMAS_JOB}=true`);
        expect(track).toHaveBeenCalledWith("Søk - la til filter", { filterGroup: "Julejobb" });
    });

    it("har ingen automatiske UU-feil i sesongfilteret", async () => {
        const user = userEvent.setup();
        const { container } = renderFiltersMobile();

        await user.click(screen.getByRole("button", { name: "Filter" }));
        await user.click(screen.getByRole("button", { name: "Sesong" }));

        await act(async () => {
            await runAxeTest(container);
        });
    });
});
