import { describe, expect, it, vi } from "vitest";
import onboardingFixture from "@/features/ung/onboarding/server/mock/onboarding.fixture.json";
import { createSharedContentClient } from "@/features/ung/onboarding/server/sharedContentClient.server";

const RESOURCE_ID = "8eb7f9d6-361c-4ac0-92c6-b272374e84d5";

describe("sharedContentClient", () => {
    it("henter og validerer et JSON:API-dokument uten å cache eller følge redirects", async () => {
        const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(
            new Response(JSON.stringify(onboardingFixture), {
                status: 200,
                headers: {
                    "content-type": "application/vnd.api+json; charset=utf-8",
                },
            }),
        );
        const clientResult = createSharedContentClient(
            {
                apiUrl: "https://cms.staging.karriereveiledning.no",
                apiKey: "test-key",
            },
            fetchImplementation,
        );
        if (!clientResult.ok) {
            throw new Error("Forventet gyldig klientkonfigurasjon");
        }

        const result = await clientResult.data.getArticle(RESOURCE_ID);

        expect(result.ok).toBe(true);
        expect(fetchImplementation).toHaveBeenCalledOnce();
        const [requestUrl, requestInit] = fetchImplementation.mock.calls[0] ?? [];
        const url = new URL(String(requestUrl));
        expect(url.origin + url.pathname).toBe(
            `https://cms.staging.karriereveiledning.no/jsonapi/node/shared_content/${RESOURCE_ID}`,
        );
        expect(url.searchParams.get("include")?.split(",")).toContain("field_sc_content.field_accordion_items");
        expect(requestInit).toMatchObject({
            method: "GET",
            cache: "no-store",
            redirect: "error",
        });
        expect(new Headers(requestInit?.headers).get("api-key")).toBe("test-key");
        expect(new Headers(requestInit?.headers).get("accept")).toBe("application/vnd.api+json");
        expect(requestInit?.signal).toBeInstanceOf(AbortSignal);
    });

    it("avviser usikker API-URL før fetch", () => {
        const fetchImplementation = vi.fn<typeof fetch>();

        const result = createSharedContentClient(
            {
                apiUrl: "http://cms.staging.karriereveiledning.no/path",
                apiKey: "test-key",
            },
            fetchImplementation,
        );

        expect(result).toMatchObject({
            ok: false,
            error: {
                type: "configuration",
            },
        });
        expect(fetchImplementation).not.toHaveBeenCalled();
    });

    it("avviser ugyldig artikkel-ID før fetch", async () => {
        const fetchImplementation = vi.fn<typeof fetch>();
        const clientResult = createSharedContentClient(
            {
                apiUrl: "https://cms.staging.karriereveiledning.no",
                apiKey: "test-key",
            },
            fetchImplementation,
        );
        if (!clientResult.ok) {
            throw new Error("Forventet gyldig klientkonfigurasjon");
        }

        const result = await clientResult.data.getArticle("ikke-en-uuid");

        expect(result).toMatchObject({
            ok: false,
            error: {
                type: "invalid-request",
            },
        });
        expect(fetchImplementation).not.toHaveBeenCalled();
    });

    it("returnerer HTTP-status uten å lese feilresponsen", async () => {
        const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(
            new Response("Unauthorized", {
                status: 401,
                headers: {
                    "content-type": "text/plain",
                },
            }),
        );
        const clientResult = createSharedContentClient(
            {
                apiUrl: "https://cms.staging.karriereveiledning.no",
                apiKey: "test-key",
            },
            fetchImplementation,
        );
        if (!clientResult.ok) {
            throw new Error("Forventet gyldig klientkonfigurasjon");
        }

        const result = await clientResult.data.getArticle(RESOURCE_ID);

        expect(result).toEqual({
            ok: false,
            error: {
                type: "http",
                message: "Shared Content svarte med en feilstatus",
                status: 401,
            },
        });
    });

    it("avviser JSON som ikke følger kontrakten", async () => {
        const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(
            new Response(JSON.stringify({ data: [] }), {
                status: 200,
                headers: {
                    "content-type": "application/json",
                },
            }),
        );
        const clientResult = createSharedContentClient(
            {
                apiUrl: "https://cms.staging.karriereveiledning.no",
                apiKey: "test-key",
            },
            fetchImplementation,
        );
        if (!clientResult.ok) {
            throw new Error("Forventet gyldig klientkonfigurasjon");
        }

        const result = await clientResult.data.getArticle(RESOURCE_ID);

        expect(result).toMatchObject({
            ok: false,
            error: {
                type: "invalid-contract",
            },
        });
    });
});
