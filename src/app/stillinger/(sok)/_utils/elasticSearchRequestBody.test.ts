import { describe, expect, it } from "vitest";
import elasticSearchRequestBody from "./elasticSearchRequestBody";
import { SEARCH_CHUNK_SIZE } from "./query";
import { type ExtendedQuery } from "./fetchElasticSearch";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toJson(value: unknown): string {
    return JSON.stringify(value);
}

function getPostFilters(body: ReturnType<typeof elasticSearchRequestBody>): readonly unknown[] {
    const postFilter = body["post_filter"];

    if (!isRecord(postFilter)) {
        return [];
    }

    const boolValue = postFilter["bool"];
    if (!isRecord(boolValue)) {
        return [];
    }

    const filters = boolValue["filter"];
    if (!Array.isArray(filters)) {
        return [];
    }

    return filters;
}

function getAggregationFilters(
    body: ReturnType<typeof elasticSearchRequestBody>,
    aggregationKey: string,
): readonly unknown[] {
    const aggregations = body["aggs"];

    if (!isRecord(aggregations)) {
        return [];
    }

    const aggregation = aggregations[aggregationKey];
    if (!isRecord(aggregation)) {
        return [];
    }

    const filterValue = aggregation["filter"];
    if (!isRecord(filterValue)) {
        return [];
    }

    const boolValue = filterValue["bool"];
    if (!isRecord(boolValue)) {
        return [];
    }

    const filters = boolValue["filter"];
    if (!Array.isArray(filters)) {
        return [];
    }

    return filters;
}

function getSortArray(body: ReturnType<typeof elasticSearchRequestBody>): readonly unknown[] {
    const sortValue = body["sort"];

    if (!Array.isArray(sortValue)) {
        return [];
    }

    return sortValue;
}

describe("elasticSearchRequestBody", () => {
    it("inkluderer flere aktive filtre samtidig i post_filter", () => {
        const query: ExtendedQuery = {
            q: ["frontend utvikler"],
            sector: ["Privat"],
            education: ["Ingen krav"],
            workLanguage: ["Engelsk"],
            published: "now-3d",
            size: 20,
        };

        const body = elasticSearchRequestBody(query);
        const postFiltersJson = toJson(getPostFilters(body));

        expect(postFiltersJson).toContain('"sector_facet"');
        expect(postFiltersJson).toContain('"Privat"');

        expect(postFiltersJson).toContain('"education_facet"');
        expect(postFiltersJson).toContain('"Ingen krav"');

        expect(postFiltersJson).toContain('"worklanguage_facet"');
        expect(postFiltersJson).toContain('"Engelsk"');

        expect(postFiltersJson).toContain('"published"');
        expect(postFiltersJson).toContain('"now-3d"');
    });

    it("sector-aggregasjonen ekskluderer sector, men beholder education", () => {
        const query: ExtendedQuery = {
            q: ["frontend utvikler"],
            sector: ["Privat"],
            education: ["Ingen krav"],
            size: 20,
        };

        const body = elasticSearchRequestBody(query);
        const sectorAggFiltersJson = toJson(getAggregationFilters(body, "sector"));

        expect(sectorAggFiltersJson).not.toContain('"sector_facet"');
        expect(sectorAggFiltersJson).not.toContain('"Privat"');

        expect(sectorAggFiltersJson).toContain('"education_facet"');
        expect(sectorAggFiltersJson).toContain('"Ingen krav"');
    });

    it("education-aggregasjonen ekskluderer education, men beholder sector", () => {
        const query: ExtendedQuery = {
            q: ["frontend utvikler"],
            sector: ["Privat"],
            education: ["Ingen krav"],
            size: 20,
        };

        const body = elasticSearchRequestBody(query);
        const educationAggFiltersJson = toJson(getAggregationFilters(body, "education"));

        expect(educationAggFiltersJson).not.toContain('"education_facet"');
        expect(educationAggFiltersJson).not.toContain('"Ingen krav"');

        expect(educationAggFiltersJson).toContain('"sector_facet"');
        expect(educationAggFiltersJson).toContain('"Privat"');
    });

    it("published-aggregasjonen ekskluderer published i filterdelen", () => {
        const query: ExtendedQuery = {
            q: ["frontend utvikler"],
            published: "now-3d",
            sector: ["Privat"],
            size: 20,
        };

        const body = elasticSearchRequestBody(query);
        const publishedAggFiltersJson = toJson(getAggregationFilters(body, "published"));

        expect(publishedAggFiltersJson).not.toContain('"published"');
        expect(publishedAggFiltersJson).not.toContain('"now-3d"');

        expect(publishedAggFiltersJson).toContain('"sector_facet"');
        expect(publishedAggFiltersJson).toContain('"Privat"');
    });

    it("counties-aggregasjonen ekskluderer location-filter, men beholder andre filtre", () => {
        const query: ExtendedQuery = {
            q: ["frontend utvikler"],
            counties: ["AKERSHUS"],
            municipals: ["AKERSHUS.ASKER"],
            sector: ["Privat"],
            size: 20,
        };

        const body = elasticSearchRequestBody(query);
        const countiesAggFiltersJson = toJson(getAggregationFilters(body, "counties"));

        expect(countiesAggFiltersJson).not.toContain('"locationList.county.keyword"');
        expect(countiesAggFiltersJson).not.toContain('"AKERSHUS"');
        expect(countiesAggFiltersJson).not.toContain('"locationList.municipal.keyword"');
        expect(countiesAggFiltersJson).not.toContain('"ASKER"');

        expect(countiesAggFiltersJson).toContain('"sector_facet"');
        expect(countiesAggFiltersJson).toContain('"Privat"');
    });

    it("countries-aggregasjonen beholder ekstra filter som ekskluderer NORGE", () => {
        const query: ExtendedQuery = {
            q: ["frontend utvikler"],
            sector: ["Privat"],
            size: 20,
        };

        const body = elasticSearchRequestBody(query);
        const countriesAggFiltersJson = toJson(getAggregationFilters(body, "countries"));

        expect(countriesAggFiltersJson).toContain('"locationList.country.keyword"');
        expect(countriesAggFiltersJson).toContain('"NORGE"');

        expect(countriesAggFiltersJson).toContain('"sector_facet"');
        expect(countriesAggFiltersJson).toContain('"Privat"');
    });

    it("experience-aggregasjonen ekskluderer både experience og withinDrivingDistance slik koden gjør i dag", () => {
        const query: ExtendedQuery = {
            q: ["frontend utvikler"],
            experience: ["Ingen"],
            withinDrivingDistance: {
                postcodes: ["1234"],
                municipals: [],
                counties: [],
            },
            size: 20,
        };

        const body = elasticSearchRequestBody(query);

        const postFiltersJson = toJson(getPostFilters(body));
        const experienceAggFiltersJson = toJson(getAggregationFilters(body, "experience"));

        expect(postFiltersJson).toContain('"experience_facet"');
        expect(postFiltersJson).toContain('"Ingen"');
        expect(postFiltersJson).toContain('"locationList.postalCode"');
        expect(postFiltersJson).toContain('"1234"');

        expect(experienceAggFiltersJson).not.toContain('"experience_facet"');
        expect(experienceAggFiltersJson).not.toContain('"Ingen"');
        expect(experienceAggFiltersJson).not.toContain('"locationList.postalCode"');
        expect(experienceAggFiltersJson).not.toContain('"1234"');
    });

    it("bruker published-sort når q mangler og sort ikke er satt", () => {
        const query: ExtendedQuery = {
            size: 20,
        };

        const body = elasticSearchRequestBody(query);
        const sortArray = getSortArray(body);
        const sortJson = toJson(sortArray);

        expect(sortJson).toContain('"published"');
        expect(sortJson).toContain('"desc"');
    });

    it("beholder expires-sort når q mangler og sort er expires", () => {
        const query: ExtendedQuery = {
            sort: "expires",
            size: 20,
        };

        const body = elasticSearchRequestBody(query);
        const sortArray = getSortArray(body);
        const sortJson = toJson(sortArray);

        expect(sortJson).toContain('"expires"');
        expect(sortJson).toContain('"asc"');
    });

    it("faller tilbake til SEARCH_CHUNK_SIZE når size ikke er tillatt", () => {
        const query: ExtendedQuery = {
            q: ["frontend utvikler"],
            size: 999,
        };

        const body = elasticSearchRequestBody(query);

        expect(body.size).toBe(SEARCH_CHUNK_SIZE);
    });
});
