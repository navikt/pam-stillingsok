import { describe, expect, it } from "vitest";
import { safeParseSharedContentDocument } from "@/features/ung/onboarding/server/sharedContentSchemas";

describe("safeParseSharedContentDocument", () => {
    it("godtar et enkeltressurssvar uten included", () => {
        const result = safeParseSharedContentDocument({
            data: {
                type: "node--shared_content",
                id: "8eb7f9d6-361c-4ac0-92c6-b272374e84d5",
                attributes: {
                    title: "Testinnhold",
                },
            },
        });

        expect(result).toEqual({
            ok: true,
            data: {
                data: {
                    type: "node--shared_content",
                    id: "8eb7f9d6-361c-4ac0-92c6-b272374e84d5",
                    attributes: {
                        title: "Testinnhold",
                    },
                },
                included: [],
            },
        });
    });

    it("avviser dokument uten toppressurs", () => {
        const result = safeParseSharedContentDocument({
            jsonapi: { version: "1.0" },
            included: [],
        });

        expect(result.ok).toBe(false);
        if (result.ok) {
            throw new Error("Forventet kontraktfeil");
        }
        expect(result.issues.length).toBeGreaterThan(0);
    });

    it("avviser relasjoner uten type og id", () => {
        const result = safeParseSharedContentDocument({
            data: {
                type: "node--shared_content_onboarding",
                id: "module",
                attributes: {},
                relationships: {
                    field_questions: {
                        data: [{ id: "question" }],
                    },
                },
            },
            included: [],
        });

        expect(result.ok).toBe(false);
    });
});
