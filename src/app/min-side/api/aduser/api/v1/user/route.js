import {
    createAuthorizationAndContentTypeHeaders,
    CSRF_COOKIE_NAME,
    exchangeToken,
} from "@/app/min-side/_common/utils/tokenUtils";

import logger from "@/app/min-side/_common/utils/logger";

export const userUrl = `${process.env.PAMADUSER_URL}/api/v1/user`;

export async function GET(request) {
    logger.info("GET user");
    const token = await exchangeToken(request);
    const res = await fetch(userUrl, {
        method: "GET",
        headers: createAuthorizationAndContentTypeHeaders(token),
    }).catch((err) => {
        logger.error(`GET user fetch feilet '${err}'`);
        return new Response("Fetch feilet", {
            status: 500,
        });
    });

    if (!res.ok) {
        if (res.status !== 404) {
            const text = await res.text();
            logger.error(`GET user feilet status: ${res.status} text: ${text}`);
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

    //TODO: INVESTIGATE THIS CALL
    const res = await fetch(userUrl, {
        method: "POST",
        headers: createAuthorizationAndContentTypeHeaders(token, request.cookies.get(CSRF_COOKIE_NAME)?.value),
        body: request.body,
        credentials: "same-origin",
        duplex: "half",
    }).catch((err) => {
        logger.error(`POST user fetch feilet '${err}'`);
        return new Response("Fetch feilet", {
            status: 500,
        });
    });

    if (!res.ok) {
        const text = await res.text();
        logger.error(`POST user feilet status: ${res.status} text: ${text}`);
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
        logger.error(`PUT user fetch feilet '${err}'`);
        return new Response("Fetch feilet", {
            status: 500,
        });
    });

    if (!res.ok) {
        const text = await res.text();
        logger.error(`PUT user feilet status: ${res.status} text: ${text}`);
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
        logger.error(`DELETE user fetch feilet '${err}'`);
        return new Response("Fetch feilet", {
            status: 500,
        });
    });

    if (!res.ok) {
        const text = await res.text();
        logger.error(`DELETE user feilet status: ${res.status} text: ${text}`);
        return new Response("En feil skjedde", {
            status: res.status,
        });
    }

    return Response.json("{}");
}
