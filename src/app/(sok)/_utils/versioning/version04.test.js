import { describe, expect, test } from "vitest";
import { migrateToV4 } from "@/app/(sok)/_utils/versioning/version04";

describe("version04", () => {
    test("Should migrate Kontor og økonomi.Kontor, forvaltning og saksbehandling", () => {
        const outdatedPattern = new URLSearchParams([
            ["occupationLevel1", "Kontor og økonomi"],
            ["occupationLevel2", "Kontor og økonomi.Kontor, forvaltning og saksbehandling"],
        ]);
        const expectedPattern = new URLSearchParams([
            ["occupationLevel1", "Kontor og økonomi"],
            ["occupationLevel2", "Kontor og økonomi.Kontor, forvaltning og saksbehandling"],
            ["occupationLevel1", "Kultur og kreative yrker"],
            ["occupationLevel2", "Kultur og kreative yrker.Museum, bibliotek, arkiv"],
        ]);
        const migratedSearchParams = migrateToV4(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });

    test("Should not change other params", () => {
        const outdatedPattern = new URLSearchParams([
            ["occupationLevel1", "Kontor og økonomi"],
            ["occupationLevel2", "Kontor og økonomi.Kontor, forvaltning og saksbehandling"],
            ["q", "test"],
        ]);
        const expectedPattern = new URLSearchParams([
            ["occupationLevel1", "Kontor og økonomi"],
            ["occupationLevel2", "Kontor og økonomi.Kontor, forvaltning og saksbehandling"],
            ["q", "test"],
            ["occupationLevel1", "Kultur og kreative yrker"],
            ["occupationLevel2", "Kultur og kreative yrker.Museum, bibliotek, arkiv"],
        ]);
        const migratedSearchParams = migrateToV4(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });
});
