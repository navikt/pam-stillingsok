import { test, expect } from "@playwright/test";

test("/stillinger/api/search should return response OK", async ({ request }) => {
    const response = await request.get("/stillinger/api/search");
    expect(response.ok()).toBeTruthy();
});

test("/stillinger/api/search should return search hits", async ({ request }) => {
    const response = await request.get("/stillinger/api/search");
    const data = await response.json();
    expect(data).toEqual(
        expect.objectContaining({
            hits: expect.objectContaining({
                total: expect.objectContaining({ value: expect.any(Number) }),
                hits: expect.arrayContaining([
                    expect.objectContaining({
                        _source: expect.objectContaining({
                            uuid: expect.any(String),
                        }),
                    }),
                ]),
            }),
        }),
    );
});

test("/stillinger/api/search should migrate outdated url params", async ({ request }) => {
    const urlWithOutdatedSearchParamName = "/stillinger/api/search?occupationFirstLevels[]=IT";
    const response = await request.get(urlWithOutdatedSearchParamName);
    const data = await response.json();
    expect(data).toEqual(
        expect.objectContaining({
            hits: expect.objectContaining({
                hits: expect.arrayContaining([
                    expect.objectContaining({
                        _source: expect.objectContaining({
                            occupationList: expect.arrayContaining([
                                expect.objectContaining({ level1: expect.stringMatching("IT") }),
                            ]),
                        }),
                    }),
                ]),
            }),
        }),
    );
});
