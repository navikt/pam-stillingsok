import { describe, expect, test } from "vitest";
import { toApiQuery } from "@/app/stillinger/(sok)/_utils/query";
import elasticQuery from "@/app/stillinger/(sok)/elastic/elasticSearchRequestBody";
import { IKKE_OPPGITT } from "@/app/stillinger/(sok)/elastic/filter/constants";
import { filterExperience } from "@/app/stillinger/(sok)/elastic/filter/filterExperience";

const FIELD = "workExperience_facet";

describe("filterExperience", () => {
    test("returns empty array when experience is undefined", () => {
        expect(filterExperience(undefined)).toEqual([]);
    });

    test("returns empty array when experience is empty", () => {
        expect(filterExperience([])).toEqual([]);
    });

    test("uses workExperience_facet as term field for regular values", () => {
        const result = filterExperience(["Ingen"]);
        const termQuery = result[0].bool?.should?.[0] as { term: Record<string, string> };
        expect(termQuery.term).toHaveProperty(FIELD);
    });

    test("uses must_not exists on workExperience_facet for IKKE_OPPGITT", () => {
        const result = filterExperience([IKKE_OPPGITT]);
        const mustNotQuery = result[0].bool?.should?.[0] as {
            bool: { must_not: [{ exists: { field: string } }] };
        };
        expect(mustNotQuery.bool.must_not[0].exists.field).toBe(FIELD);
    });

    test("does not add a term query for IKKE_OPPGITT", () => {
        const result = filterExperience([IKKE_OPPGITT]);
        const should = result[0].bool?.should ?? [];
        const hasTermQuery = should.some((clause) => "term" in clause);
        expect(hasTermQuery).toBe(false);
    });

    test("handles mix of regular value and IKKE_OPPGITT", () => {
        const result = filterExperience(["Ingen", IKKE_OPPGITT]);
        const should = result[0].bool?.should ?? [];
        expect(should).toHaveLength(2);

        const termQuery = should.find((c) => "term" in c) as { term: Record<string, string> };
        expect(termQuery.term).toHaveProperty(FIELD, "Ingen");

        const mustNotQuery = should.find((c) => "bool" in c) as {
            bool: { must_not: [{ exists: { field: string } }] };
        };
        expect(mustNotQuery.bool.must_not[0].exists.field).toBe(FIELD);
    });
});

describe("experience aggregation field name", () => {
    test("aggregation uses workExperience_facet", () => {
        const request = elasticQuery(toApiQuery({}));
        const experienceAgg = (request.aggs as Record<string, unknown>)?.experience as {
            aggs: { values: { terms: { field: string } } };
        };
        expect(experienceAgg.aggs.values.terms.field).toBe(FIELD);
    });
});
