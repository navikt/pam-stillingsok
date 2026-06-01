import { describe, expect, test } from "vitest";
import { toApiQuery } from "@/app/stillinger/(sok)/_utils/query";
import elasticQuery from "@/app/stillinger/(sok)/elastic/elasticSearchRequestBody";

describe("elasticSearchRequestBody", () => {
    test("Request should have 'from'", () => {
        const request = elasticQuery(toApiQuery({}));
        expect(request).toHaveProperty("from");
    });

    test("Request should have 'size'", () => {
        const request = elasticQuery(toApiQuery({}));
        expect(request).toHaveProperty("size");
    });

    test("Request should have 'query'", () => {
        const request = elasticQuery(toApiQuery({}));
        expect(request).toHaveProperty("query");
    });

    test("Request should have 'post_filter'", () => {
        const request = elasticQuery(toApiQuery({}));
        expect(request).toHaveProperty("post_filter");
    });

    test("Request should have 'aggs'", () => {
        const request = elasticQuery(toApiQuery({}));
        expect(request).toHaveProperty("aggs");
    });

    test("Request should have '_source'", () => {
        const request = elasticQuery(toApiQuery({}));
        expect(request).toHaveProperty("_source");
    });

    test("Request should have '_source.includes'", () => {
        const request = elasticQuery(toApiQuery({}));
        expect(request._source).toHaveProperty("includes");
    });
});
