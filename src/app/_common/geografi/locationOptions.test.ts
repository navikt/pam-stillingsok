import { describe, expect, it } from "vitest";
import {
    buildLocationOptions,
    filterLocationOptions,
    MAX_LOCATION_OPTIONS,
} from "@/app/_common/geografi/locationOptions";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";

describe("locationOptions", () => {
    it("buildLocationOptions inkluder fylker, kommuner og Utland", () => {
        const locations: readonly SearchLocation[] = [
            {
                key: "TROMS",
                label: "Troms",
                code: "19",
                municipals: [{ key: "TROMS.TROMSØ", label: "Tromsø", code: "5401" }],
            },
            { key: "UTLAND", label: "Utland", code: "999", municipals: [] },
        ];

        const options = buildLocationOptions(locations);

        expect(options.some((o) => o.value === "TROMS" && o.kind === "county")).toBe(true);
        expect(options.some((o) => o.value === "TROMS.TROMSØ" && o.kind === "municipal")).toBe(true);
        expect(options.some((o) => o.value === "UTLAND" && o.kind === "abroad")).toBe(true);
    });

    it("filterLocationOptions matcher uten å skille mellom store og små bokstaver", () => {
        const options = [
            { value: "TROMS", label: "Troms (fylke)", kind: "county" as const },
            { value: "TROMS.TROMSØ", label: "Tromsø (kommune)", kind: "municipal" as const },
        ];

        const filtered = filterLocationOptions(options, "tromsø");
        expect(filtered.map((o) => o.value)).toEqual(["TROMS.TROMSØ"]);
    });

    it("filterLocationOptions begrenser resultater til MAX_LOCATION_OPTIONS", () => {
        const options = Array.from({ length: MAX_LOCATION_OPTIONS + 50 }).map((_, index) => {
            return { value: `v${index}`, label: `Sted ${index}`, kind: "municipal" as const };
        });

        const filtered = filterLocationOptions(options, "sted");
        expect(filtered.length).toBe(MAX_LOCATION_OPTIONS);
    });
});
