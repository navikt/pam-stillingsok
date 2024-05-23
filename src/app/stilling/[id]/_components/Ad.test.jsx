import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import runAxeTest from "@/app/_common/utils/runAxeTest";
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

// Mock router
vi.mock("next/navigation", async (importOriginal) => {
    const actual = await importOriginal;
    const { useRouter } = (await vi.importActual) < typeof import("next-router-mock") > "next-router-mock";
    const usePathname = vi.fn().mockImplementation(() => {
        const router = useRouter();
        return router.pathname;
    });
    const useSearchParams = vi.fn().mockImplementation(() => {
        const router = useRouter();
        return new URLSearchParams(router.query?.toString());
    });
    return {
        ...actual,
        useRouter: vi.fn().mockImplementation(useRouter),
        usePathname,
        useSearchParams,
    };
});

describe("Ad", () => {
    test("should render how to apply for active ads with an application email", () => {
        render(<Ad adData={activeAd} />);

        const howToApply = screen.queryByText("Søk på jobben");

        expect(howToApply).toBeInTheDocument();
    });

    test("should not render how to apply if ad is inactive", async () => {
        const { container } = render(<Ad adData={inactiveAd} />);

        await runAxeTest(container);

        const howToApply = screen.queryByText("Søk på jobben");

        expect(howToApply).not.toBeInTheDocument();
    });
});
