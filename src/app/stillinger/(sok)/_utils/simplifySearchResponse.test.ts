import { describe, expect, it } from "vitest";
import { StillingSoekResponseSchema } from "@/server/schemas/stillingSearchSchema";
import simplifySearchResponse from "./simplifySearchResponse";

function makeResponse(
    xmasJob: {
        doc_count: number;
        values?: { buckets?: { key: number; key_as_string: string; doc_count: number }[] };
    },
    hits: unknown[] = [],
) {
    const result = StillingSoekResponseSchema.safeParse({
        took: 1,
        timed_out: false,
        _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
        hits: {
            total: { value: hits.length, relation: "eq" },
            max_score: null,
            hits,
        },
        aggregations: {
            positioncount: { doc_count: 0, sum: { value: 0 } },
            summerJob: { doc_count: 0, values: {} },
            xmasJob,
        },
    });

    if (!result.success) {
        throw result.error;
    }

    return result.data;
}

describe("simplifySearchResponse", () => {
    it("maps the xmasJob true bucket", () => {
        const response = simplifySearchResponse(
            makeResponse({
                doc_count: 1,
                values: { buckets: [{ key: 1, key_as_string: "true", doc_count: 1 }] },
            }),
        );

        expect(response.aggregations.xmasJob).toEqual([{ key: "true", count: 1 }]);
    });

    it("returns empty xmasJob buckets when buckets are missing, like summerJob", () => {
        const response = simplifySearchResponse(makeResponse({ doc_count: 0, values: {} }));

        expect(response.aggregations.xmasJob).toEqual([]);
        expect(response.aggregations.summerJob).toEqual([]);
    });

    it.each([
        ["en", "en"],
        ["PT-br", "pt-BR"],
        [null, null],
        [undefined, null],
        [42, null],
        ["en_GB", null],
    ])("retains hits and maps adLanguageCode %j to %j", (adLanguageCode, expected) => {
        const response = simplifySearchResponse(
            makeResponse({ doc_count: 0, values: {} }, [
                {
                    _index: "jobs",
                    _id: "job-1",
                    _score: 1,
                    _source: {
                        uuid: "job-1",
                        source: "test",
                        medium: "test",
                        expires: "2026-12-31",
                        businessName: "Test employer",
                        published: "2026-01-01",
                        title: "Test job",
                        reference: "test-reference",
                        occupationList: [],
                        generatedSearchMetadata: adLanguageCode === undefined ? {} : { adLanguageCode },
                    },
                },
            ]),
        );

        expect(response.ads).toHaveLength(1);
        expect(response.ads[0].uuid).toBe("job-1");
        expect(response.ads[0].generatedSearchMetadata?.adLanguageCode).toBe(expected);
    });
});
