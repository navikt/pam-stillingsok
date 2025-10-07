import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import Ad from "./Ad";
import { act } from "react";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";

const activeAd: AdDTO = {
    title: "Test",
    adTextHtml: "Test test test",
    status: "ACTIVE",
    applicationEmail: "test@test.no",
    id: "c9e8bc5c-05a9-4f06-a102-544b1b3e6ae8",
    published: "2024-10-11T13:22:22.000Z",
    expires: "2024-10-31T23:00:00.000Z",
    updated: "2024-10-11T13:23:11.685Z",
    source: "Stillingsregistrering",
    reference: "c9e8bc5c-05a9-4f06-a102-544b1b3e6ae8",
    medium: "Stillingsregistrering",
    applicationDue: "2024-11-01",
    applicationUrl: undefined,
    sourceUrl: undefined,
    hasSuperraskSoknad: true,
    adTextFormat: "strukturert",
    businessName: "Konsekvent Kul Tiger As",
    engagementType: "Fast",
    extent: ["Heltid"],
    jobArrangement: "Skift",
    jobPercentage: "80%",
    jobPercentageRange: undefined,
    jobTitle: "Utvikler (Frontend- og backend)",
    positionCount: 1,
    remote: "Hybridkontor",
    startTime: "Etter avtale",
    workdays: ["Ukedager", "Lørdag", "Søndag"],
    workHours: ["Dagtid", "Kveld", "Natt"],
    workLanguages: ["Norsk", "Samisk", "Skandinavisk", "Engelsk"],
    locationList: [
        {
            address: "Skoletoppen 1",
            city: "VESTMARKA",
            county: "INNLANDET",
            postalCode: "2233",
            municipal: "EIDSKOG",
            country: "NORGE",
        },
        { county: "OSLO", municipal: "OSLO", country: "NORGE" },
        { country: "SVERIGE" },
        { county: "SVALBARD", municipal: "SVALBARD", country: "NORGE" },
    ],
    location: undefined,
    employer: {
        name: "Konsekvent Kul Tiger As",
        sector: "Privat",
        homepage: "https://arbeidsplassen.no",
        linkedinPage: "https://arbeidsplassen.no",
        twitterAddress: "https://arbeidsplassen.no",
        facebookPage: "https://arbeidsplassen.no",
        descriptionHtml:
            "<p>Curabitur in quam in enim malesuada tempor. Ut nulla sem, porttitor id massa id, maximus semper urna. Aenean quis aliquet urna. Duis quis odio ac sem porta consectetur eget sit amet metus. Sed maximus eros mi, eget semper metus pulvinar vel. Nunc eu dui risus. In varius, nulla et porta vestibulum, nibh sem facilisis mi, quis efficitur nisi urna nec sapien.</p>\n",
    },
    contactList: [
        {
            name: "Test Testen",
            title: "Daglig leder",
            phone: "22222222",
            email: "asdasdasdasdasdasdas@dadas.dss",
        },
    ],
};

const inactiveAd = {
    ...activeAd,
    status: "INACTIVE",
};

// Mock router
vi.mock("next/navigation", async (importOriginal) => {
    const actual = await importOriginal;

    const { useRouter } = await vi.importActual<typeof import("next-router-mock")>("next-router-mock");
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

        await act(async () => {
            await runAxeTest(container);
        });

        const howToApply = screen.queryByText("Søk på jobben");

        expect(howToApply).not.toBeInTheDocument();
    });
});
