import { describe, it, expect } from "vitest";
import { experiments } from "./experiments";

describe("experiments config", () => {
    it("skal ha unike nøkler", () => {
        const keys = experiments.map((e) => e.key);
        const unique = new Set(keys);
        expect(unique.size).toBe(keys.length);
    });

    it("skal ha trafficPercent i området 0..100", () => {
        for (const def of experiments) {
            expect(def.trafficPercent).toBeGreaterThanOrEqual(0);
            expect(def.trafficPercent).toBeLessThanOrEqual(100);
        }
    });

    it("skal ha variantvekter som summerer til 100", () => {
        for (const def of experiments) {
            const sum = def.variants.reduce((acc, v) => {
                return acc + v.weightPercent;
            }, 0);

            expect(sum).toBe(100);
        }
    });

    it("skal ikke ha dupliserte variantnøkler innenfor et eksperiment", () => {
        for (const def of experiments) {
            const keys = def.variants.map((v) => v.key);
            const unique = new Set(keys);
            expect(unique.size).toBe(keys.length);
        }
    });

    it('skal ha pathPrefixes som starter med "/" når de er tilstede', () => {
        for (const def of experiments) {
            for (const prefix of def.pathPrefixes ?? []) {
                expect(prefix.startsWith("/")).toBe(true);
            }
        }
    });
});
