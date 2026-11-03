import { describe, expect, test } from "vitest";
import { toApiQuery } from "@/app/stillinger/(sok)/_utils/query";
import buildAggregations from "@/app/stillinger/(sok)/elastic/buildAggregations";
import elasticQuery from "@/app/stillinger/(sok)/elastic/elasticSearchRequestBody";
import { buildAllFilters } from "@/app/stillinger/(sok)/elastic/filter/buildAllFilters";
import { filterSeason } from "@/app/stillinger/(sok)/elastic/filter/filterSeason";

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

    test("Season filter is empty when neither season is selected", () => {
        expect(filterSeason()).toEqual([]);
    });

    test.each([
        [true, false, { term: { "generatedSearchMetadata.summerJobMetadata.isSummerJob": true } }],
        [false, true, { term: { "generatedSearchMetadata.xmasJobMetadata.isXmasJob": true } }],
    ])("Season filter includes only its selected filter (%s, %s)", (isSummerJob, isXmasJob, expectedFilter) => {
        expect(filterSeason(isSummerJob, isXmasJob)).toEqual([expectedFilter]);
    });

    test("Season filter matches either summer or Xmas jobs when both are selected", () => {
        expect(filterSeason(true, true)).toEqual([
            {
                bool: {
                    should: [
                        { term: { "generatedSearchMetadata.summerJobMetadata.isSummerJob": true } },
                        { term: { "generatedSearchMetadata.xmasJobMetadata.isXmasJob": true } },
                    ],
                    minimum_should_match: 1,
                },
            },
        ]);
    });

    test("Summer and Xmas facets exclude the season group but retain another filter", () => {
        const query = toApiQuery({ isXmasJob: true, isSummerJob: true, sector: ["Privat"] });
        const aggregations = buildAggregations(query);
        const nonSeasonFilters = buildAllFilters(query, "season");
        const sectorFilter = {
            bool: {
                should: [{ term: { sector_facet: "Privat" } }],
            },
        };

        expect(nonSeasonFilters).toContainEqual(sectorFilter);
        for (const aggregation of [aggregations.summerJob, aggregations.xmasJob]) {
            const facetFilters = aggregation.filter.bool.filter;

            expect(facetFilters).toEqual(nonSeasonFilters);
            expect(facetFilters).toContainEqual(sectorFilter);
            expect(facetFilters).not.toContainEqual(
                expect.objectContaining({
                    term: expect.objectContaining({
                        "generatedSearchMetadata.summerJobMetadata.isSummerJob": true,
                    }),
                }),
            );
            expect(facetFilters).not.toContainEqual(
                expect.objectContaining({
                    term: expect.objectContaining({
                        "generatedSearchMetadata.xmasJobMetadata.isXmasJob": true,
                    }),
                }),
            );
        }

        expect(aggregations.summerJob.aggs.values.terms.field).toBe(
            "generatedSearchMetadata.summerJobMetadata.isSummerJob",
        );
        expect(aggregations.xmasJob.aggs.values.terms.field).toBe("generatedSearchMetadata.xmasJobMetadata.isXmasJob");
    });
});
