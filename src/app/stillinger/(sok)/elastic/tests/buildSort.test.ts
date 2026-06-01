import { describe, expect, test } from "vitest";
import buildSort from "@/app/stillinger/(sok)/elastic/buildSort";

describe("buildSort", () => {
    test("Should return undefined if sort is set to 'relevant'", () => {
        const query = {
            q: ["test"],
            sort: "relevant",
        };
        const sort = buildSort(query);
        expect(sort).toBe(undefined);
    });

    test("Should return 'published' as desc if q is not defined", () => {
        const query = {};
        const sort = buildSort(query);
        expect(sort).toEqual([{ published: { order: "desc" } }, "_score", "_id"]);
    });

    test("Should return 'expires' as asc", () => {
        const query = { sort: "expires" };
        const sort = buildSort(query);
        expect(sort).toEqual([{ expires: { order: "asc" } }, "_score", "_id"]);
    });
});
