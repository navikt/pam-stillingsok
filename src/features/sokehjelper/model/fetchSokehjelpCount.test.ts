import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchSokehjelpCount } from "./fetchSokehjelpCount";
import type { WizardState } from "./sokehjelperTypes";

vi.mock("@/app/stillinger/_common/utils/fetch", () => ({
    getDefaultHeaders: vi.fn().mockResolvedValue({}),
}));

const validState: WizardState = {
    jobbtypes: [],
    steder: [],
    county: null,
    municipal: null,
    yrker: ["annet"],
    fritekst: "kokk",
    aktivtSteg: 1,
};

describe("fetchSokehjelpCount", () => {
    beforeEach(() => {
        vi.stubEnv("PAMSEARCHAPI_URL", "http://search-api.test");
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllEnvs();
    });

    it.each([
        ["feil struktur", { jobbtypes: null }],
        ["tomt objekt", {}],
        ["e-post i fritekst", { ...validState, fritekst: "ola@nav.no" }],
        ["for lang fritekst", { ...validState, fritekst: "a".repeat(101) }],
    ])("returnerer null uten å kalle søket ved ugyldig input: %s", async (_navn, input) => {
        const fetchSpy = vi.spyOn(globalThis, "fetch");
        const result = await fetchSokehjelpCount(input as unknown as WizardState);
        expect(result).toBeNull();
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("henter antall uten treff og aggregeringer", async () => {
        const fetchSpy = vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue(Response.json({ timed_out: false, hits: { total: { value: 42 } } }));

        expect(await fetchSokehjelpCount(validState)).toBe(42);
        expect(fetchSpy).toHaveBeenCalledTimes(1);

        const options = fetchSpy.mock.calls[0][1];
        const body = JSON.parse(options?.body as string);
        expect(body.size).toBe(0);
        expect(body.aggs).toBeUndefined();
        expect(body.timeout).toBe("2s");
        expect(options?.signal).toBeInstanceOf(AbortSignal);
    });

    it("henter ny telling når søket endres", async () => {
        const fetchSpy = vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(Response.json({ hits: { total: { value: 42 } } }))
            .mockResolvedValueOnce(Response.json({ hits: { total: { value: 7 } } }));

        expect(await fetchSokehjelpCount(validState)).toBe(42);
        expect(await fetchSokehjelpCount({ ...validState, fritekst: "sykepleier" })).toBe(7);
        expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it.each([
        ["HTTP-feil", () => new Response(null, { status: 503 })],
        ["tidsavbrudd", () => Response.json({ timed_out: true, hits: { total: { value: 3 } } })],
        ["ugyldig respons", () => Response.json({ hits: { total: { value: -1 } } })],
    ])("returnerer null ved %s", async (_name, response) => {
        vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(response());

        expect(await fetchSokehjelpCount(validState)).toBeNull();
    });

    it("returnerer null ved nettverksfeil", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new DOMException("Timeout", "TimeoutError"));

        expect(await fetchSokehjelpCount(validState)).toBeNull();
    });
});
