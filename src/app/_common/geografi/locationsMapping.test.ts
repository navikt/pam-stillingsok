import { describe, expect, it } from "vitest";
import { mapGeografiTilLocations } from "./locationsMapping";

describe("mapGeografiTilLocations", () => {
    it("bygger fylker med tilhørende kommuner og legger til UTLAND", () => {
        const locations = mapGeografiTilLocations({
            counties: [{ navn: "Oslo", fylkesnummer: "03" }],
            municipals: [
                { navn: "Oslo", fylkesnummer: "03", kommunenummer: "0301" },
                { navn: "Bergen", fylkesnummer: "46", kommunenummer: "4601" },
            ],
        });

        expect(locations).toHaveLength(2);
        expect(locations[0]?.key).toBe("Oslo");
        expect(locations[0]?.municipals).toHaveLength(1);
        expect(locations[0]?.municipals[0]?.key).toBe("Oslo.Oslo");
        expect(locations[1]?.key).toBe("UTLAND");
    });
});
