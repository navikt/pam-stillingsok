import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { PUT } from "./route";

vi.mock("@/app/min-side/_common/auth/auth.server", () => {
    return {
        CSRF_COOKIE_NAME: "XSRF-TOKEN-ARBEIDSPLASSEN",
        exchangeToken: vi.fn(async () => ({ ok: true, token: "exchanged-token" })),
        createAuthorizationAndContentTypeHeaders: vi.fn(() => {
            const headers = new Headers();
            headers.set("authorization", "Bearer exchanged-token");
            headers.set("content-type", "application/json");
            return headers;
        }),
    };
});

describe("PUT /min-side/api/aduser/api/v1/resendverificationemail", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        process.env.PAMADUSER_URL = "https://aduser.example";
    });

    it("returns 401 when exchangeToken fails", async () => {
        const { exchangeToken } = await import("@/app/min-side/_common/auth/auth.server");

        vi.mocked(exchangeToken).mockResolvedValueOnce({
            ok: false,
            response: new Response("Unauthorized", { status: 401 }),
        });

        const request = new NextRequest("https://app.example/min-side/api/aduser/api/v1/resendverificationemail", {
            method: "PUT",
        });

        const response = await PUT(request);
        expect(response.status).toBe(401);
    });

    it("returns 200 when upstream returns ok", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => {
                return new Response(null, { status: 204 });
            }),
        );

        const request = new NextRequest("https://app.example/min-side/api/aduser/api/v1/resendverificationemail", {
            method: "PUT",
        });

        const response = await PUT(request);
        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({});
    });

    it("returns upstream error text when upstream fails", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => {
                return new Response("Bad request", { status: 400, headers: { "content-type": "text/plain" } });
            }),
        );

        const request = new NextRequest("https://app.example/min-side/api/aduser/api/v1/resendverificationemail", {
            method: "PUT",
        });

        const response = await PUT(request);
        expect(response.status).toBe(400);
        await expect(response.text()).resolves.toBe("Bad request");
    });
});
