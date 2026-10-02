import { describe, expect, it } from "vitest";
import {
    safeParseSharedContentCollection,
    safeParseSharedContentDocument,
} from "@/features/ung/onboarding/server/drupal/jsonApi";

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
        expect(result.error).toMatchObject({ type: "invalid-contract", issuePaths: ["data"] });
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

    it("normaliserer included: null til tom liste (Drupal returnerer dette ved manglende tilgang)", () => {
        const result = safeParseSharedContentDocument({
            data: {
                type: "node--shared_content",
                id: "8eb7f9d6-361c-4ac0-92c6-b272374e84d5",
                attributes: { title: "Testinnhold" },
            },
            included: null,
        });

        expect(result).toMatchObject({ ok: true, data: { included: [] } });
    });
});

describe("safeParseSharedContentCollection", () => {
    it("godtar den faktiske tomme responsen Drupal gir uten gyldig api-key (data: [], included: null)", () => {
        const result = safeParseSharedContentCollection({
            jsonapi: { version: "1.1" },
            data: [],
            meta: { count: 0 },
            links: { self: { href: "https://cms.staging.karriereveiledning.no/jsonapi/node/shared_content" } },
            included: null,
        });

        expect(result).toMatchObject({ ok: true, data: { data: [], included: [] } });
    });
});
