import { render } from "@testing-library/react";
import { StrictMode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "@/app/_common/umami";
import { readExperimentAssignments } from "../next/experiments.server";
import { type ClientExperimentAssignment, ExperimentsProvider, useExperimentConversion } from "../react/Experiments";

vi.mock("@/app/_common/umami", () => ({ track: vi.fn() }));

const KEY = "ny-cta" as never;
const newAssignment: ClientExperimentAssignment = { key: "ny-cta", variant: "test", assignmentVersion: 1, isNew: true };

function Converter({ location }: Readonly<{ location?: string }>) {
    const convert = useExperimentConversion();
    convert(KEY, "cta_click", location);
    return null;
}

describe("assignmentTracking", () => {
    beforeEach(() => {
        vi.mocked(track).mockClear();
    });

    it("sender én eksponering per ny tildeling, også i StrictMode", () => {
        render(
            <StrictMode>
                <ExperimentsProvider assignments={[newAssignment]}>{null}</ExperimentsProvider>
            </StrictMode>,
        );
        expect(track).toHaveBeenCalledTimes(1);
        expect(track).toHaveBeenCalledWith("AB - eksponering", {
            experiment: "ny-cta",
            assignmentVersion: 1,
            variant: "test",
        });
    });

    it("sender ingen eksponering for eksisterende tildeling", () => {
        render(
            <ExperimentsProvider assignments={[{ ...newAssignment, key: "gammel", isNew: false }]}>
                {null}
            </ExperimentsProvider>,
        );
        expect(track).not.toHaveBeenCalled();
    });

    it("sender konvertering med versjon og valgfri location, bare med tildeling", () => {
        render(
            <ExperimentsProvider assignments={[{ ...newAssignment, isNew: false }]}>
                <Converter location="annonse" />
            </ExperimentsProvider>,
        );
        expect(track).toHaveBeenCalledWith("AB - konvertering", {
            experiment: "ny-cta",
            assignmentVersion: 1,
            variant: "test",
            konvertering: "cta_click",
            location: "annonse",
        });

        vi.mocked(track).mockClear();
        render(
            <ExperimentsProvider assignments={[]}>
                <Converter />
            </ExperimentsProvider>,
        );
        expect(track).not.toHaveBeenCalled();
    });

    it("lar ikke bucketing-ID følge med til klienten", async () => {
        const id = "f".repeat(32);
        const consent = {
            version: 2,
            timestamp: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            consent: { analytics: true, skyraSurveys: false },
            state: { userActionTaken: true },
        };
        const headers = new Headers({
            cookie: `arbeidsplassen-consent=${encodeURIComponent(JSON.stringify(consent))}; ab_uid=${id}; ab_ny-cta=1.test`,
        });
        const assignments = await readExperimentAssignments(
            headers,
            [
                {
                    key: "ny-cta",
                    status: "on",
                    assignmentVersion: 1,
                    owner: "t",
                    endsAt: "2099-01-01T00:00:00Z",
                    eligiblePathPrefixes: ["/"],
                },
            ],
            new Date("2026-06-01T00:00:00Z"),
        );
        expect(assignments).toHaveLength(1);
        expect(JSON.stringify(assignments)).not.toMatch(/[0-9a-f]{32}/);
    });
});
