import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import runAxeTest from "@/app/_common/utils/runAxeTest";
import { MappedAdDTO } from "@/app/lib/stillingSoekSchema";
import Ad from "./Ad";
import { act } from "react";

const activeAd: MappedAdDTO = {
    title: "Test",
    adText: "Test test test",
    status: "ACTIVE",
    applicationEmail: "test@test.no",
    id: "c9e8bc5c-05a9-4f06-a102-544b1b3e6ae8",
    published: new Date("2024-10-11T13:22:22.000Z"),
    expires: new Date("2024-10-31T23:00:00.000Z"),
    updated: new Date("2024-10-11T13:23:11.685Z"),
    source: "Stillingsregistrering",
    reference: "c9e8bc5c-05a9-4f06-a102-544b1b3e6ae8",
    medium: "Stillingsregistrering",
    applicationDue: "2024-11-01",
    applicationUrl: undefined,
    sourceUrl: undefined,
    hasSuperraskSoknad: "true",
    jobPostingFormat: "strukturert",
    adNumber: 962179,
    businessName: "Konsekvent Kul Tiger As",
    engagementType: "Fast",
    extent: "Heltid",
    jobArrangement: "Skift",
    jobPercentage: "80%",
    jobPercentageRange: undefined,
    jobTitle: "Utvikler (Frontend- og backend)",
    positionCount: "1",
    remote: "Hybridkontor",
    startTime: "Etter avtale",
    workdays: "Ukedager, Lørdag, Søndag",
    workHours: "Dagtid, Kveld, Natt",
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
        description:
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
    categoryList: [
        {
            id: 2394863,
            code: "386027",
            categoryType: "JANZZ",
            name: "Utvikler (Frontend- og backend)",
            description: null,
            parentId: null,
        },
        {
            id: 2394864,
            code: "http://data.europa.eu/esco/occupation/f2b15a0e-e65a-438a-affb-29b9d50b77d1",
            categoryType: "ESCO",
            name: "Utvikler (Frontend- og backend)",
            description: null,
            parentId: null,
        },
        {
            id: 2394865,
            code: "2512",
            categoryType: "STYRK08",
            name: "Programvareutviklere",
            description: null,
            parentId: null,
        },
    ],
    searchtags: [{ label: "Utvikler (Frontend- og backend)", score: 1 }],
    education: undefined,
    experience: undefined,
    needDriversLicense: ["false"],
    under18: undefined,
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
