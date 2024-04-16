"use server";

import logger from "@/app/_common/utils/logger";
import { cookies } from "next/headers";
import {
    ADUSER_XSRF_COOKIE_NAME,
    getAdUserDefaultAuthHeadersWithCsrfToken,
    getAdUserOboToken,
    getDefaultAuthHeaders,
} from "../auth/auth";

const ADUSER_USER_URL = `${process.env.PAMADUSER_URL}/api/v1/user`;

export async function getUser() {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch (e) {
        return { success: false, statusCode: 401 };
    }

    const res = await fetch(ADUSER_USER_URL, {
        method: "GET",
        headers: getDefaultAuthHeaders(oboToken),
    });

    const adUserXsrfCookieMatch = res.headers
        .get("Set-cookie")
        ?.match(new RegExp(`${ADUSER_XSRF_COOKIE_NAME}=([^;,]+)`));
    const cookieValue = adUserXsrfCookieMatch ? adUserXsrfCookieMatch[1] : null;
    if (cookieValue) {
        cookies().set(ADUSER_XSRF_COOKIE_NAME, cookieValue, { path: "/" });
    }

    if (!res.ok) {
        if (!res.status === 404) {
            logger.error(`GET user from aduser failed. ${res.status} ${res.statusText}`);
        }
        return { success: false, statusCode: res.status };
    }
    const data = await res.json();
    return { success: true, data };
}

export async function createUser(user) {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch (e) {
        return new Response(null, { status: 401 });
    }

    const res = await fetch(ADUSER_USER_URL, {
        method: "POST",
        body: JSON.stringify(user),
        credentials: "same-origin",
        duplex: "half",
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    if (!res.ok) {
        logger.error(`POST user to aduser failed. ${res.status} ${res.statusText}`);
        return { success: false };
    }

    const data = await res.json();
    return { success: true, data };
}

export async function updateUser(user) {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch (e) {
        return { success: false, statusCode: 401 };
    }

    const res = await fetch(ADUSER_USER_URL, {
        method: "PUT",
        body: JSON.stringify(user),
        credentials: "same-origin",
        duplex: "half",
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    if (!res.ok) {
        logger.error(`PUT user to aduser failed. ${res.status} ${res.statusText}`);
        return { success: false, statusCode: res.status };
    }

    const data = await res.json();
    return { success: true, data };
}
