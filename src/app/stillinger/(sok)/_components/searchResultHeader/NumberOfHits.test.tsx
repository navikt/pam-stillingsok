import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import NumberOfHits from "@/app/stillinger/(sok)/_components/searchResultHeader/NumberOfHits";

describe("NumberOfHits", () => {
    test("it shows the correct number of hits", () => {
        render(<NumberOfHits totalAds={230} totalPositions={310} />);
        expect(screen.getByText("230 treff")).toBeInTheDocument();
    });

    test("it shows 'Ingen treff' when there are no hits", () => {
        render(<NumberOfHits totalAds={0} totalPositions={0} />);
        expect(screen.getByText("Ingen treff")).toBeInTheDocument();
    });

    test("it shows the correct number of positions", () => {
        render(<NumberOfHits totalAds={230} totalPositions={310} />);
        expect(screen.getByText("310 stillinger")).toBeInTheDocument();
    });

    test("it uses singular if there is only one position", () => {
        render(<NumberOfHits totalAds={1} totalPositions={1} />);
        expect(screen.getByText("1 stilling")).toBeInTheDocument();
    });

    test("it uses plural if there is more than one position", () => {
        render(<NumberOfHits totalAds={1} totalPositions={3} />);
        expect(screen.getByText("3 stillinger")).toBeInTheDocument();
    });

    test("it formats the number of positions if it is over 999", () => {
        render(<NumberOfHits totalAds={10000} totalPositions={19000} />);
        expect(screen.getByText("19 000 stillinger")).toBeInTheDocument();
    });

    test("It formats the number of hits if it is over 999", () => {
        render(<NumberOfHits totalAds={10000} totalPositions={19000} />);
        expect(screen.getByText("10 000 treff")).toBeInTheDocument();
    });
});
