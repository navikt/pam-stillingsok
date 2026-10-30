import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/consent/ab/route";
import type { ExperimentDefinition } from "../core/experiments";
import { planConsentCookieChanges } from "../next/experiments.server";

const NOW = new Date("2026-06-01T12:00:00Z");
const VALID_ID = "0123456789abcdef0123456789abcdef";

const activeExperiment: ExperimentDefinition = {
    key: "ny-cta",
    status: "on",
    assignmentVersion: 1,
    owner: "team-arbeidsplassen",
    endsAt: "2099-12-31T23:59:59Z",
    eligiblePathPrefixes: ["/"],
};
const pausedExperiment: ExperimentDefinition = { ...activeExperiment, key: "pauset", status: "off" };

function consentCookie(analytics: boolean): string {
    const consent = {
        version: 2,
        timestamp: { createdAt: NOW.toISOString(), updatedAt: NOW.toISOString() },
        consent: { analytics, skyraSurveys: false },
        state: { userActionTaken: true },
    };
    return `arbeidsplassen-consent=${encodeURIComponent(JSON.stringify(consent))}`;
}

describe("planConsentCookieChanges", () => {
    it.each<[string, string | null, ReadonlyArray<ExperimentDefinition>, string[]]>([
        [
            "samtykke, tomt register: ingen ny ID",
            consentCookie(true),
            [],
            ["delete:ab_qualifications_soek_superrask_cta"],
        ],
        [
            "samtykke, kun pauset eksperiment: ingen ny ID",
            consentCookie(true),
            [pausedExperiment],
            ["delete:ab_qualifications_soek_superrask_cta"],
        ],
        [
            "samtykke, aktivt eksperiment, mangler ID: ny ID",
            consentCookie(true),
            [activeExperiment],
            ["delete:ab_qualifications_soek_superrask_cta", "set:ab_uid"],
        ],
        [
            "samtykke, aktivt eksperiment, gyldig ID: beholder ID",
            `${consentCookie(true)}; ab_uid=${VALID_ID}`,
            [activeExperiment],
            ["delete:ab_qualifications_soek_superrask_cta"],
        ],
        [
            "samtykke, ugyldig ID: erstattes",
            `${consentCookie(true)}; ab_uid=ugyldig`,
            [activeExperiment],
            ["delete:ab_qualifications_soek_superrask_cta", "set:ab_uid"],
        ],
        [
            "samtykke, to ulike ID-er: erstattes",
            `${consentCookie(true)}; ab_uid=${VALID_ID}; ab_uid=${"f".repeat(32)}`,
            [activeExperiment],
            ["delete:ab_qualifications_soek_superrask_cta", "set:ab_uid"],
        ],
        [
            "uten samtykke: sletter alle eide navn",
            consentCookie(false),
            [activeExperiment, pausedExperiment],
            ["delete:ab_uid", "delete:ab_ny-cta", "delete:ab_pauset", "delete:ab_qualifications_soek_superrask_cta"],
        ],
        [
            "ingen cookie-header: sletter eide navn",
            null,
            [],
            ["delete:ab_uid", "delete:ab_qualifications_soek_superrask_cta"],
        ],
        [
            "samtykke-cookie som kaster URIError: tolkes som uten samtykke",
            "arbeidsplassen-consent=%E0%A4%A",
            [],
            ["delete:ab_uid", "delete:ab_qualifications_soek_superrask_cta"],
        ],
    ])("%s", (_name, cookieHeader, registry, expected) => {
        const changes = planConsentCookieChanges(cookieHeader, registry, NOW);
        expect(changes.map((change) => `${change.action}:${change.name}`)).toEqual(expected);
    });

    it("oppretter ID som består av 32 hex-tegn", () => {
        const changes = planConsentCookieChanges(consentCookie(true), [activeExperiment], NOW);
        const created = changes.find((change) => change.action === "set");
        expect(created?.action === "set" && created.value).toMatch(/^[0-9a-f]{32}$/);
    });
});

describe("POST /api/consent/ab", () => {
    function post(headers: Record<string, string>): Promise<Response> {
        return POST(new NextRequest("https://www.test.no/api/consent/ab", { method: "POST", headers }));
    }

    it("sletter gammel cookie ved samtykke", async () => {
        const response = await post({ cookie: consentCookie(true), "sec-fetch-site": "same-origin" });
        expect(response.status).toBe(200);
        expect(response.headers.get("set-cookie")).toContain("ab_qualifications_soek_superrask_cta=;");
    });

    it("avviser cross-site uten å endre cookies", async () => {
        const response = await post({ cookie: consentCookie(false), "sec-fetch-site": "cross-site" });
        expect(response.status).toBe(403);
        expect(response.headers.get("set-cookie")).toBeNull();
    });

    it("svarer 200 og sletter når samtykke-cookien ikke kan dekodes", async () => {
        const response = await post({ cookie: "arbeidsplassen-consent=%E0%A4%A; ab_uid=" + VALID_ID });
        expect(response.status).toBe(200);
        expect(response.headers.get("set-cookie")).toContain("ab_uid=;");
    });
});
