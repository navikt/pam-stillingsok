import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/consent/ab/route";
import type { ExperimentDefinition } from "../core/experiments";
import {
    planConsentCookieChanges,
    readExperimentAssignments,
    resolveExperimentRequest,
} from "../next/experiments.server";

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
        const response = await post({ cookie: `arbeidsplassen-consent=%E0%A4%A; ab_uid=${VALID_ID}` });
        expect(response.status).toBe(200);
        expect(response.headers.get("set-cookie")).toContain("ab_uid=;");
    });
});

const TEST_ID = "f".repeat(32); // ny-cta, versjon 1 gir `test` (se experiments.test.ts)
const pageDefaults = { method: "GET", pathname: "/stillinger/stilling/1", isRsc: false, isDocumentRequest: true };

async function resolve(
    cookie: string | null,
    options: Partial<typeof pageDefaults> & {
        extraHeaders?: Record<string, string>;
        registry?: ReadonlyArray<ExperimentDefinition>;
    } = {},
) {
    const { extraHeaders, registry = [activeExperiment], ...rest } = options;
    const requestHeaders = new Headers(extraHeaders);
    if (cookie !== null) {
        requestHeaders.set("cookie", cookie);
    }
    const changes = await resolveExperimentRequest({ ...pageDefaults, ...rest, requestHeaders }, registry, NOW);
    return { changes: changes.map((change) => `${change.action}:${change.name}`), requestHeaders };
}

describe("resolveExperimentRequest", () => {
    const withId = `${consentCookie(true)}; ab_uid=${TEST_ID}`;

    it("tildeler ved første request og markerer tildelingen som ny", async () => {
        const { changes, requestHeaders } = await resolve(withId);
        expect(changes).toEqual(["set:ab_ny-cta"]);
        expect(requestHeaders.get("cookie")).toContain("ab_ny-cta=1.test");
        expect(requestHeaders.get("x-ab-new")).toBe("ny-cta.1.test");
    });

    it("tildeler også i RSC-request", async () => {
        const { changes } = await resolve(withId, { isRsc: true, isDocumentRequest: false });
        expect(changes).toEqual(["set:ab_ny-cta"]);
    });

    it("tildeler før rendering når Next har normalisert bort RSC-informasjonen", async () => {
        const { changes, requestHeaders } = await resolve(withId, { isRsc: false, isDocumentRequest: false });
        expect(changes).toEqual(["set:ab_ny-cta"]);
        expect(await readExperimentAssignments(requestHeaders, [activeExperiment], NOW)).toEqual([
            { key: "ny-cta", variant: "test", assignmentVersion: 1, isNew: true },
        ]);
    });

    it.each(["POST", "HEAD", "OPTIONS"])("tildeler ikke ved %s", async (method) => {
        const { changes } = await resolve(withId, { method });
        expect(changes).toEqual([]);
    });

    it("behandler ikke normalisert fetch utenfor eksperimentsider", async () => {
        const { changes } = await resolve(withId, {
            pathname: "/annen-side",
            isDocumentRequest: false,
            registry: [{ ...activeExperiment, eligiblePathPrefixes: ["/stillinger/stilling"] }],
        });
        expect(changes).toEqual([]);
    });

    it("oppretter ikke ID ved normalisert klientnavigasjon", async () => {
        const { changes } = await resolve(consentCookie(true), { isDocumentRequest: false });
        expect(changes).toEqual([]);
    });

    it("tildeler ikke ved normalisert klientnavigasjon uten samtykke", async () => {
        const { changes, requestHeaders } = await resolve(`ab_uid=${TEST_ID}`, { isDocumentRequest: false });
        expect(changes).toEqual(["delete:ab_uid"]);
        expect(requestHeaders.get("x-ab-new")).toBeNull();
    });

    it.each<Record<string, string>>([
        { "next-router-prefetch": "1" },
        { "next-router-segment-prefetch": "/_tree" },
        { purpose: "prefetch" },
    ])("tildeler ikke ved prefetch: %j", async (extraHeaders) => {
        const { changes } = await resolve(withId, { isDocumentRequest: false, extraHeaders });
        expect(changes).toEqual([]);
    });

    it("gjør ingenting når tildelingen allerede finnes", async () => {
        const { changes, requestHeaders } = await resolve(`${withId}; ab_ny-cta=1.test`);
        expect(changes).toEqual([]);
        expect(requestHeaders.get("x-ab-new")).toBeNull();
    });

    it("sletter og fjerner eide cookies fra videresendt header uten samtykke", async () => {
        const { changes, requestHeaders } = await resolve(
            `${consentCookie(false)}; ab_uid=${TEST_ID}; ab_ny-cta=1.test; annen=1`,
        );
        expect(changes).toEqual(["delete:ab_uid", "delete:ab_ny-cta"]);
        expect(requestHeaders.get("cookie")).not.toContain("ab_");
        expect(requestHeaders.get("cookie")).toContain("annen=1");
    });

    it("behandler samtykke som kaster URIError som uten samtykke", async () => {
        const { changes } = await resolve(`arbeidsplassen-consent=%E0%A4%A; ab_uid=${TEST_ID}`);
        expect(changes).toEqual(["delete:ab_uid"]);
    });

    it.each([
        ["off", { ...activeExperiment, key: "pauset", status: "off" as const }],
        ["utløpt", { ...activeExperiment, key: "pauset", endsAt: "2026-01-01T00:00:00Z" }],
    ])("sletter tildelingscookien når eksperimentet er %s", async (_name, definition) => {
        const { changes, requestHeaders } = await resolve(`${withId}; ab_pauset=1.test`, { registry: [definition] });
        expect(changes).toEqual(["delete:ab_pauset"]);
        expect(requestHeaders.get("cookie")).not.toContain("ab_pauset");
    });

    it("erstatter ugyldig tildelingscookie", async () => {
        const { changes, requestHeaders } = await resolve(`${withId}; ab_ny-cta=1.standard`);
        expect(changes).toEqual(["set:ab_ny-cta"]);
        expect(requestHeaders.get("x-ab-new")).toBe("ny-cta.1.test");
    });

    it("oppretter ID uten tildeling når den mangler, og sletter gamle tildelinger", async () => {
        const { changes, requestHeaders } = await resolve(`${consentCookie(true)}; ab_ny-cta=1.test`);
        expect(changes).toEqual(["delete:ab_ny-cta", "set:ab_uid"]);
        expect(requestHeaders.get("x-ab-new")).toBeNull();
        expect(requestHeaders.get("cookie")).not.toContain("ab_ny-cta");
    });

    it("oppretter ikke ID i RSC-request", async () => {
        const { changes } = await resolve(consentCookie(true), { isRsc: true, isDocumentRequest: false });
        expect(changes).toEqual([]);
    });

    it("videresender duplikate cookies som én verdi", async () => {
        const { requestHeaders } = await resolve(`${withId}; ab_ny-cta=1.standard; ab_ny-cta=1.test; ab_ny-cta`);
        expect(requestHeaders.get("cookie")?.match(/ab_ny-cta/g)).toHaveLength(1);
    });

    it("fjerner alle innkommende x-ab-* headere", async () => {
        const extraHeaders = { "x-ab-new": "ny-cta.1.test", "x-ab-a": "1", "x-ab-b": "2", "x-ab-c": "3" };
        const { requestHeaders } = await resolve(consentCookie(true), { extraHeaders, registry: [] });
        expect([...requestHeaders.keys()].filter((name) => name.startsWith("x-ab-"))).toEqual([]);
    });

    it("rører ikke prefetch eller filer som sitemap.xml", async () => {
        const prefetch = await resolve(withId, { extraHeaders: { "next-router-prefetch": "1" } });
        const sitemap = await resolve(withId, { pathname: "/sitemap.xml" });
        expect(prefetch.changes).toEqual([]);
        expect(sitemap.changes).toEqual([]);
        expect(sitemap.requestHeaders.get("x-ab-new")).toBeNull();
    });

    it("er fail-open og fjerner fortsatt x-ab-*", async () => {
        const broken = {
            ...activeExperiment,
            get eligiblePathPrefixes(): string[] {
                throw new Error("feil med hemmelig verdi");
            },
        };
        const { changes, requestHeaders } = await resolve(withId, {
            extraHeaders: { "x-ab-new": "x" },
            registry: [broken],
        });
        expect(changes).toEqual([]);
        expect(requestHeaders.get("x-ab-new")).toBeNull();
    });
});

describe("readExperimentAssignments", () => {
    const cookie = `${consentCookie(true)}; ab_uid=${TEST_ID}; ab_ny-cta=1.test`;

    function read(headers: Record<string, string>) {
        return readExperimentAssignments(new Headers(headers), [activeExperiment], NOW);
    }

    it("leser gyldig tildeling og markør", async () => {
        expect(await read({ cookie, "x-ab-new": "ny-cta.1.test" })).toEqual([
            { key: "ny-cta", variant: "test", assignmentVersion: 1, isNew: true },
        ]);
    });

    it("ignorerer markør på prefetch", async () => {
        const [assignment] = await read({ cookie, "x-ab-new": "ny-cta.1.test", "next-router-prefetch": "1" });
        expect(assignment?.isNew).toBe(false);
    });

    it("ignorerer cookie med feil variant, uten samtykke og uten ID", async () => {
        expect(await read({ cookie: cookie.replace("1.test", "1.standard") })).toEqual([]);
        expect(await read({ cookie: `${consentCookie(false)}; ab_uid=${TEST_ID}; ab_ny-cta=1.test` })).toEqual([]);
        expect(await read({ cookie: `${consentCookie(true)}; ab_ny-cta=1.test` })).toEqual([]);
    });
});
