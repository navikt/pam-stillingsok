import { describe, expect, test } from "vitest";
import { createQuery, DEFAULT_SORTING, SEARCH_CHUNK_SIZE, toApiQuery } from "@/app/stillinger/(sok)/_utils/query";
import { CURRENT_VERSION } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";

describe("createQuery", () => {
    test("Should parse size param", () => {
        const query = createQuery({ size: "25" });
        expect(query.size).toEqual(25);
    });

    test("Should parse size param", () => {
        const query = createQuery({ size: "100" });
        expect(query.size).toEqual(100);
    });

    test("Should return default size, if provided value is not allowed", () => {
        const query = createQuery({ size: "9999" });
        expect(query.size).toEqual(SEARCH_CHUNK_SIZE);
    });

    test("Should parse from param", () => {
        const query = createQuery({ from: "100" });
        expect(query.from).toEqual(100);
    });

    test("Should return 0 if provided from param is invalid", () => {
        const query = createQuery({ from: "abc" });
        expect(query.from).toEqual(0);
    });

    test("Should parse url version param", () => {
        const query = createQuery({ from: "5" });
        expect(query.v).toEqual(5);
    });

    test("Should return default url version param if provided value is invalid", () => {
        const query = createQuery({ v: "abc" });
        expect(query.v).toEqual(CURRENT_VERSION);
    });

    test("Should parse several q params", () => {
        const query = createQuery({ q: ["abc", "dfg"] });
        expect(query.q).toEqual(["abc", "dfg"]);
    });

    test("Should parse single q", () => {
        const query = createQuery({ q: "abc" });
        expect(query.q).toEqual(["abc"]);
    });

    test("Should parse international param", () => {
        const query = createQuery({ international: "true" });
        expect(query.international).toEqual(true);
    });

    test("Should parse international param", () => {
        const query = createQuery({ international: "false" });
        expect(query.international).toEqual(undefined);
    });

    test("Should parse sort param", () => {
        const query = createQuery({ sort: "published" });
        expect(query.sort).toEqual("published");
    });

    test("Should return default sort param if not provided", () => {
        const query = createQuery({});
        expect(query.sort).toEqual(DEFAULT_SORTING);
    });

    test("Should return default sort param if provided value is not allowed", () => {
        const query = createQuery({ sort: "not-supported" });
        expect(query.sort).toEqual(DEFAULT_SORTING);
    });
});

describe("toApiQuery", () => {
    test("Should remove postcode if distance is not provided", () => {
        const query = toApiQuery({ postcode: "0001" });
        expect(query.postcode).toEqual(undefined);
    });

    test("Should remove distance if postcode is not provided", () => {
        const query = toApiQuery({ distance: "5" });
        expect(query.distance).toEqual(undefined);
    });

    test("Should not remove postcode and distance if both are provided", () => {
        const query = toApiQuery({ distance: "5", postcode: "0001" });
        expect(query.distance).toEqual("5");
        expect(query.postcode).toEqual("0001");
    });
});
