import { describe, expect, it } from "vitest";
import { StillingSoekResponseSchema } from "@/server/schemas/stillingSearchSchema";
import simplifySearchResponse from "./simplifySearchResponse";

function makeResponse(xmasJob: {
    doc_count: number;
    values?: { buckets?: { key: number; key_as_string: string; doc_count: number }[] };
}) {
    const result = StillingSoekResponseSchema.safeParse({
        took: 1,
        timed_out: false,
        _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
        hits: {
            total: { value: 0, relation: "eq" },
            max_score: null,
            hits: [],
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
});
