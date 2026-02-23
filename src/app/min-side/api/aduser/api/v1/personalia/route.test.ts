import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

vi.mock("@/app/min-side/_common/auth/auth.server", () => {
    return {
        exchangeToken: vi.fn(async () => ({ ok: true, token: "exchanged-token" })),
        createAuthorizationAndContentTypeHeaders: vi.fn(() => {
            const headers = new Headers();
            headers.set("authorization", "Bearer exchanged-token");
            headers.set("content-type", "application/json");
            return headers;
        }),
    };
});

describe("GET /min-side/api/aduser/api/v1/personalia", () => {
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

        const request = new NextRequest("https://app.example/min-side/api/aduser/api/v1/personalia", { method: "GET" });
        const response = await GET(request);

        expect(response.status).toBe(401);
        await expect(response.text()).resolves.toBe("Unauthorized");
    });

    it("proxies 200 response from upstream", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => {
                return new Response(JSON.stringify({ foo: "bar" }), {
                    status: 200,
                    headers: { "content-type": "application/json" },
                });
            }),
        );

        const request = new NextRequest("https://app.example/min-side/api/aduser/api/v1/personalia", { method: "GET" });
        const response = await GET(request);

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({ foo: "bar" });
    });
});
