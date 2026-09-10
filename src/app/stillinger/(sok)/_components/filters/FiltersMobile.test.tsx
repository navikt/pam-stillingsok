import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import type { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import FiltersMobile from "./FiltersMobile";

vi.mock("next/navigation", () => {
    return {
        useSearchParams: () => new URLSearchParams(""),
        useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
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
        summerJob: [],
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
});
