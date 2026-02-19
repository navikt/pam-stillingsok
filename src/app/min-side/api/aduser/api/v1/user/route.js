export const runtime = "nodejs";
import {
    createAuthorizationAndContentTypeHeaders,
    CSRF_COOKIE_NAME,
    exchangeToken,
} from "@/app/min-side/_common/auth/auth.server.ts";

import { logger } from "@navikt/next-logger";

export const userUrl = `${process.env.PAMADUSER_URL}/api/v1/user`;

export async function GET(request) {
    logger.info("GET user");
    const token = await exchangeToken(request);
    const res = await fetch(userUrl, {
        method: "GET",
        headers: createAuthorizationAndContentTypeHeaders(token),
    }).catch((err) => {
        logger.error(new Error(`GET user fetch feilet`, { cause: err }));
        return new Response("Fetch feilet", {
            status: 500,
        });
    });

    if (!res.ok) {
        if (res.status !== 404) {
            const text = await res.text();
            logger.error(
                new Error(`GET user feilet status`, {
                    cause: { method: "GET", url: res.url, status: res.status, statusText: text },
                }),
            );
        }
        return new Response(res.body, {
            status: res.status,
        });
    }

    const data = await res.json();
    return Response.json(data);
}

export async function POST(request) {
    logger.info("POST user");

    const token = await exchangeToken(request);

    const res = await fetch(userUrl, {
        method: "POST",
        headers: createAuthorizationAndContentTypeHeaders(token, request.cookies.get(CSRF_COOKIE_NAME)?.value),
        body: request.body,
        credentials: "same-origin",
        duplex: "half",
    }).catch((err) => {
        logger.error(new Error(`POST user fetch feilet`, { cause: err }));
        return new Response("Fetch feilet", {
            status: 500,
        });
    });

    if (!res.ok) {
        const text = await res.text();
        logger.error(
            new Error(`POST user feilet status: ${res.status} text: ${text}`, {
                cause: { method: "POST", url: res.url, status: res.status, statusText: text },
            }),
        );
        return new Response("En feil skjedde", {
            status: res.status,
        });
    }

    const data = await res.json();
    return Response.json(data);
}

export async function PUT(request) {
    logger.info("PUT user");
    const token = await exchangeToken(request);
    const res = await fetch(userUrl, {
        method: "PUT",
        headers: createAuthorizationAndContentTypeHeaders(token, request.cookies.get(CSRF_COOKIE_NAME)?.value),
        body: request.body,
        credentials: "same-origin",
        duplex: "half",
    }).catch((err) => {
        logger.error(new Error(`PUT user fetch feilet`, { cause: err }));
        return new Response("Fetch feilet", {
            status: 500,
        });
    });

    if (!res.ok) {
        const text = await res.text();
        logger.error(
            new Error(`PUT user feilet status`, {
                cause: { method: "PUT", url: res.url, status: res.status, statusText: text },
            }),
        );
        return new Response("En feil skjedde", {
            status: res.status,
        });
    }

    const data = await res.json();
    return Response.json(data);
}

export async function DELETE(request) {
    logger.info("DELETE user");
    const token = await exchangeToken(request);
    const res = await fetch(userUrl, {
        method: "DELETE",
        headers: createAuthorizationAndContentTypeHeaders(token, request.cookies.get(CSRF_COOKIE_NAME)?.value),
    }).catch((err) => {
        logger.error(new Error(`DELETE user fetch feilet`, { cause: err }));
        return new Response("Fetch feilet", {
            status: 500,
        });
    });

    if (!res.ok) {
        const text = await res.text();
        logger.error(
            new Error(`DELETE user feilet status`, {
                cause: { method: "DELETE", url: res.url, status: res.status, statusText: text },
            }),
        );
        return new Response("En feil skjedde", {
            status: res.status,
        });
    }

    return Response.json("{}");
}
