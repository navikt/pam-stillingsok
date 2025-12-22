import { describe, expect, test } from "vitest";
import { migrateToV5 } from "@/app/(nonce)/stillinger/(sok)/_utils/versioning/version05";

describe("version05", () => {
    test("Should migrate Førskolelærer to Barnehagelærer", () => {
        const outdatedPattern = new URLSearchParams([
            ["occupationLevel1", "Utdanning"],
            ["occupationLevel2", "Utdanning.Førskolelærer"],
        ]);
        const expectedPattern = new URLSearchParams([
            ["occupationLevel1", "Utdanning"],
            ["occupationLevel2", "Utdanning.Barnehagelærer"],
        ]);
        const migratedSearchParams = migrateToV5(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });

    test("Should not change other params", () => {
        const outdatedPattern = new URLSearchParams([
            ["occupationLevel1", "Utdanning"],
            ["occupationLevel2", "Utdanning.Førskolelærer"],
            ["q", "test"],
        ]);
        const expectedPattern = new URLSearchParams([
            ["occupationLevel1", "Utdanning"],
            ["q", "test"],
            ["occupationLevel2", "Utdanning.Barnehagelærer"],
        ]);
        const migratedSearchParams = migrateToV5(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });
});
