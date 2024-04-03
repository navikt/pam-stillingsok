import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Ad from "./Ad";

const activeAd = {
    title: "Test",
    adText: "Test test test",
    status: "ACTIVE",
    applicationEmail: "test@test.no",
    employer: {
        name: "Test company",
    },
};

const inactiveAd = {
    ...activeAd,
    status: "INACTIVE",
};

describe("Ad", () => {
    test("should render how to apply for active ads with an application email", () => {
        render(<Ad adData={activeAd} />);

        const howToApply = screen.queryByText("Søk på jobben");

        expect(howToApply).toBeInTheDocument();
    });

    test("should not render how to apply if ad is inactive", () => {
        render(<Ad adData={inactiveAd} />);

        const howToApply = screen.queryByText("Søk på jobben");

        expect(howToApply).not.toBeInTheDocument();
    });
});
