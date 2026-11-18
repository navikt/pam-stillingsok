import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FavouriteInternal } from "@/app/stillinger/favoritter/types/FavouriteInternal";
import FavouritesList from "./FavouritesList";
import { readFavouritePreferences } from "./favouritePreferences";

vi.mock("./FavouritesListItem", () => ({
    default: ({
        favourite,
        onFavouriteDeleted,
    }: {
        favourite: FavouriteInternal;
        onFavouriteDeleted: (uuid: string) => void;
    }) => (
        <article>
            <span>{favourite.favouriteAd.title}</span>
            <button type="button" onClick={() => onFavouriteDeleted(favourite.uuid)}>
                Slett {favourite.favouriteAd.title}
            </button>
        </article>
    ),
}));

function makeFavourite(
    uuid: string,
    title: string,
    status: string,
    created: string,
    published: string,
    expires: string,
    employer = "",
    location = "",
): FavouriteInternal {
    return {
        uuid,
        created,
        favouriteAd: {
            uuid,
            title,
            status,
            published,
            expires,
            employer,
            location,
            jobTitle: title,
            applicationdue: "",
            reference: "",
            source: "",
            hasSuperraskSoknad: false,
        },
    };
}

describe("readFavouritePreferences", () => {
    it.each([
        { filter: "expired", sort: "published" },
        { filter: ["EXPIRED", "unexpired"], sort: ["PUBLISHED", "expires"], v: "5" },
    ])("reads existing links and takes the first value when repeated: %j", (params) => {
        expect(readFavouritePreferences(params)).toEqual({
            filterPreference: "expired",
            sortPreference: "published",
        });
    });

    it.each([{}, { filter: "constructor", sort: "unknown" }])(
        "uses defaults for absent or invalid values: %j",
        (params) => {
            expect(readFavouritePreferences(params)).toEqual({
                filterPreference: "unexpired",
                sortPreference: "favourite_date",
            });
        },
    );
});

describe("FavouritesList", () => {
    beforeEach(() => {
        window.history.replaceState(null, "", "/stillinger/favoritter?from=10&other=value#annonser");
    });

    afterEach(() => {
        window.history.replaceState(null, "", "/");
    });

    it("filters search terms across fields within the selected status, and clears with the Search control", async () => {
        const user = userEvent.setup();
        render(
            <FavouritesList
                favourites={[
                    makeFavourite(
                        "active-1",
                        "C++-utvikler",
                        "ACTIVE",
                        "2024-01-01",
                        "2024-02-01",
                        "2024-08-01",
                        "",
                        "Tromsø",
                    ),
                    makeFavourite(
                        "active-2",
                        "Designer",
                        "ACTIVE",
                        "2024-02-01",
                        "2024-03-01",
                        "2024-09-01",
                        "",
                        "Bergen",
                    ),
                    makeFavourite(
                        "expired",
                        "C++-konsulent",
                        "INACTIVE",
                        "2024-03-01",
                        "2024-04-01",
                        "2024-06-01",
                        "",
                        "Tromsø",
                    ),
                ]}
            />,
        );

        const searchField = screen.getByRole("searchbox", { name: "Søk blant favoritter" });
        await user.type(searchField, " tromso  C++ ");

        expect(screen.getByText("C++-utvikler")).toBeInTheDocument();
        expect(screen.queryByText("Designer")).not.toBeInTheDocument();
        expect(screen.queryByText("C++-konsulent")).not.toBeInTheDocument();
        expect(screen.getAllByText("1 treff").some((node) => !node.closest('[role="status"]'))).toBe(true);

        await user.click(screen.getByRole("button", { name: /tøm/i }));

        expect(searchField).toHaveValue("");
        expect(searchField).toHaveFocus();
        expect(screen.getByText("Designer")).toBeInTheDocument();
        expect(screen.queryByText("C++-konsulent")).not.toBeInTheDocument();

        await user.type(searchField, "Bergen");
        await user.keyboard("{Escape}");
        expect(searchField).toHaveValue("");
        expect(searchField).toHaveFocus();
        expect(screen.getByText("C++-utvikler")).toBeInTheDocument();
    });

    it("shows status-specific no-results guidance and updates the debounced live region", async () => {
        render(
            <FavouritesList
                favourites={[makeFavourite("active", "Utvikler", "ACTIVE", "2024-01-01", "2024-02-01", "2024-08-01")]}
            />,
        );

        fireEvent.change(screen.getByRole("searchbox", { name: "Søk blant favoritter" }), {
            target: { value: "Bergen" },
        });

        expect(screen.getByRole("heading", { name: "Ingen treff" })).toBeVisible();
        expect(screen.getByText(/Endre søket eller vis utløpte annonser/)).toBeVisible();

        await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Ingen treff"), { timeout: 1500 });

        await userEvent.click(screen.getByRole("checkbox", { name: "Vis utløpte annonser" }));
        expect(screen.getByText(/Endre søket eller vis aktive annonser/)).toBeVisible();
    });

    it("updates sorting and status in the list and URL without adding search parameters or history entries", async () => {
        const user = userEvent.setup();
        const historyLength = window.history.length;
        render(
            <FavouritesList
                favourites={[
                    makeFavourite("first", "Første", "ACTIVE", "2024-01-01", "2024-03-01", "2024-08-01"),
                    makeFavourite("second", "Andre", "ACTIVE", "2024-02-01", "2024-02-01", "2024-09-01"),
                    makeFavourite("expired", "Utløpt", "INACTIVE", "2024-03-01", "2024-04-01", "2024-06-01"),
                ]}
            />,
        );

        expect(screen.getAllByRole("article").map((article) => article.textContent)).toEqual([
            "AndreSlett Andre",
            "FørsteSlett Første",
        ]);

        await user.selectOptions(screen.getByRole("combobox", { name: "Sorter etter" }), "published");
        expect(screen.getAllByRole("article").map((article) => article.textContent)).toEqual([
            "FørsteSlett Første",
            "AndreSlett Andre",
        ]);
        expect(new URLSearchParams(window.location.search).get("sort")).toBe("published");

        await user.click(screen.getByRole("button", { name: "Slett Første" }));
        expect(screen.queryByText("Første")).not.toBeInTheDocument();

        await user.click(screen.getByRole("checkbox", { name: "Vis utløpte annonser" }));
        expect(screen.getByText("Utløpt")).toBeInTheDocument();
        expect(screen.queryByText("Andre")).not.toBeInTheDocument();
        expect(Object.fromEntries(new URLSearchParams(window.location.search))).toEqual({
            from: "10",
            other: "value",
            sort: "published",
            filter: "expired",
        });
        expect(window.location.pathname).toBe("/stillinger/favoritter");
        expect(window.location.hash).toBe("#annonser");
        expect(window.history.length).toBe(historyLength);
    });
});
