import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchResultItem from "@/app/stillinger/(sok)/_components/searchResult/SearchResultItem";

describe("SearchResultItem", () => {
    test("it shows the title as heading", () => {
        render(
            <SearchResultItem
                ad={{ title: "Vi søker tester" }}
                favouriteButton={undefined}
                isDebug={false}
                isFavourites={false}
            />,
        );
        expect(screen.getByRole("heading", { name: "Vi søker tester" })).toBeInTheDocument();
    });

    test("it shows the job title", () => {
        render(
            <SearchResultItem
                ad={{ jobTitle: "Software-tester" }}
                favouriteButton={undefined}
                isDebug={false}
                isFavourites={false}
            />,
        );
        expect(screen.getByText("Software-tester")).toBeInTheDocument();
    });

    test("it does not show job title if it's equal to title", () => {
        render(
            <SearchResultItem
                ad={{ title: "Software-tester", jobTitle: "Software-tester" }}
                favouriteButton={undefined}
                isDebug={false}
                isFavourites={false}
            />,
        );
        expect(screen.getAllByText("Software-tester")).toHaveLength(1);
    });

    test("it shows employer name", () => {
        render(
            <SearchResultItem
                ad={{ employer: { name: "Firmanavn" } }}
                favouriteButton={undefined}
                isDebug={false}
                isFavourites={false}
            />,
        );
        expect(screen.getByText("Firmanavn")).toBeInTheDocument();
    });

    test("it shows location", () => {
        render(
            <SearchResultItem
                ad={{
                    locationList: [
                        {
                            city: "Hamar",
                            country: "Innlandet",
                            address: null,
                            postalCode: null,
                            county: null,
                            municipal: null,
                        },
                    ],
                }}
                favouriteButton={undefined}
                isDebug={false}
                isFavourites={false}
            />,
        );
        expect(screen.getByText("Hamar")).toBeInTheDocument();
    });

    test("it shows label if ad has superrask søknad", () => {
        render(
            <SearchResultItem
                ad={{
                    hasSuperraskSoknad: "true",
                }}
                favouriteButton={undefined}
                isDebug={false}
                isFavourites={false}
            />,
        );
        expect(screen.getByText("Superrask søknad")).toBeInTheDocument();
    });

    test("it shows an expired label if ad has expired", () => {
        render(
            <SearchResultItem
                ad={{}}
                showExpired={true}
                favouriteButton={undefined}
                isDebug={false}
                isFavourites={false}
            />,
        );
        expect(screen.getByText("Annonsen er utløpt")).toBeInTheDocument();
    });

    test("it shows application due date", () => {
        render(
            <SearchResultItem
                ad={{
                    applicationDue: "1. desember",
                }}
                favouriteButton={undefined}
                isDebug={false}
                isFavourites={false}
            />,
        );
        expect(screen.getByText("Frist: 1. desember")).toBeInTheDocument();
    });

    test("it shows favorite button if provided", () => {
        render(
            <SearchResultItem
                ad={{}}
                favouriteButton={<button>Favoritt</button>}
                isDebug={false}
                isFavourites={false}
            />,
        );
        expect(screen.getByRole("button", { name: "Favoritt" })).toBeInTheDocument();
    });
});
