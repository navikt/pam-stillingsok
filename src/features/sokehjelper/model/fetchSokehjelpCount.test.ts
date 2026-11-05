import { describe, expect, it, vi } from "vitest";
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
        fetchSpy.mockRestore();
    });
});
