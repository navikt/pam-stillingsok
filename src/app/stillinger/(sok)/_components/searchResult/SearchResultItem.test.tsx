import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import SearchResultItem from "@/app/stillinger/(sok)/_components/searchResult/SearchResultItem";

describe("SearchResultItem", () => {
    test.each(["en", "nb", "nn", "pt-BR", null, undefined])(
        "it sets the ad language %s on the title link only",
        (adLanguageCode) => {
            render(
                <SearchResultItem
                    ad={{
                        title: "Vi søker tester",
                        generatedSearchMetadata: adLanguageCode === undefined ? undefined : { adLanguageCode },
                    }}
                    favouriteButton={undefined}
                    isDebug={false}
                    isFavourites={false}
                />,
            );

            const titleLink = screen.getByRole("link", { name: "Vi søker tester" });
            if (adLanguageCode) {
                expect(titleLink).toHaveAttribute("lang", adLanguageCode);
            } else {
                expect(titleLink).not.toHaveAttribute("lang");
            }
            expect(screen.getByRole("article")).not.toHaveAttribute("lang");
        },
    );

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
                favouriteButton={<button type="button">Favoritt</button>}
                isDebug={false}
                isFavourites={false}
            />,
        );
        expect(screen.getByRole("button", { name: "Favoritt" })).toBeInTheDocument();
    });
});
