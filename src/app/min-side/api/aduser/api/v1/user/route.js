import { appLogger } from "@/app/_common/logging/appLogger.ts";

export const runtime = "nodejs";
import {
    createAuthorizationAndContentTypeHeaders,
    CSRF_COOKIE_NAME,
    exchangeToken,
} from "@/app/min-side/_common/auth/auth.server.ts";

export const userUrl = `${process.env.PAMADUSER_URL}/api/v1/user`;

export async function GET(request) {
    appLogger.info("GET user");
    const token = await exchangeToken(request);
    const res = await fetch(userUrl, {
        method: "GET",
        headers: createAuthorizationAndContentTypeHeaders(token),
    }).catch((err) => {
        appLogger.errorWithCause(`GET user fetch feilet`, err);
        return new Response("Fetch feilet", {
            status: 500,
        });
    });

    if (!res.ok) {
        if (res.status !== 404) {
            const text = await res.text();
            appLogger.httpError(`GET user feilet status`, {
                method: "GET",
                url: res.url,
                status: res.status,
                statusText: text,
            });
        }
        return new Response(res.body, {
            status: res.status,
        });
    }

    const data = await res.json();
    return Response.json(data);
}

export async function POST(request) {
    appLogger.info("POST user");

    const token = await exchangeToken(request);

    const res = await fetch(userUrl, {
        method: "POST",
        headers: createAuthorizationAndContentTypeHeaders(token, request.cookies.get(CSRF_COOKIE_NAME)?.value),
        body: request.body,
        credentials: "same-origin",
        duplex: "half",
    }).catch((err) => {
        appLogger.warnWithCause(`POST user fetch feilet`, err);
        return new Response("Fetch feilet", {
            status: 500,
        });
    });

    if (!res.ok) {
        const text = await res.text();
        appLogger.httpError(`POST user feilet status`, {
            method: "POST",
            url: res.url,
            status: res.status,
            statusText: text,
        });
        return new Response("En feil skjedde", {
            status: res.status,
        });
    }

    const data = await res.json();
    return Response.json(data);
}

export async function PUT(request) {
    appLogger.info("PUT user");
    const token = await exchangeToken(request);
    const res = await fetch(userUrl, {
        method: "PUT",
        headers: createAuthorizationAndContentTypeHeaders(token, request.cookies.get(CSRF_COOKIE_NAME)?.value),
        body: request.body,
        credentials: "same-origin",
        duplex: "half",
    }).catch((err) => {
        appLogger.errorWithCause(`PUT user fetch feilet`, err);
        return new Response("Fetch feilet", {
            status: 500,
        });
    });

    if (!res.ok) {
        const text = await res.text();
        appLogger.httpError(`PUT user feilet status`, {
            method: "PUT",
            url: res.url,
            status: res.status,
            statusText: text,
        });
        return new Response("En feil skjedde", {
            status: res.status,
        });
    }

    const data = await res.json();
    return Response.json(data);
}

export async function DELETE(request) {
    appLogger.info("DELETE user");
    const token = await exchangeToken(request);
    const res = await fetch(userUrl, {
        method: "DELETE",
        headers: createAuthorizationAndContentTypeHeaders(token, request.cookies.get(CSRF_COOKIE_NAME)?.value),
    }).catch((err) => {
        appLogger.errorWithCause(`DELETE user fetch feilet`, err);
        return new Response("Fetch feilet", {
            status: 500,
        });
    });

    if (!res.ok) {
        const text = await res.text();
        appLogger.httpError(`DELETE user feilet status`, {
            method: "DELETE",
            url: res.url,
            status: res.status,
            statusText: text,
        });
        return new Response("En feil skjedde", {
            status: res.status,
        });
    }

    return Response.json("{}");
}
