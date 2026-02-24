"use server";

import { cookies } from "next/headers";
import {
    ADUSER_XSRF_COOKIE_NAME,
    getAdUserDefaultAuthHeadersWithCsrfToken,
    getAdUserOboToken,
    getDefaultAuthHeaders,
} from "../auth/auth";
import { User } from "@/app/stillinger/_common/user/UserProvider";
import { appLogger } from "@/app/_common/logging/appLogger";

const ADUSER_USER_URL = `${process.env.PAMADUSER_URL}/api/v1/user`;

export async function getUser() {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch {
        return { success: false, statusCode: 401 };
    }

    const res = await fetch(ADUSER_USER_URL, {
        method: "GET",
        headers: await getDefaultAuthHeaders(oboToken),
    });

    const adUserXsrfCookieMatch = res.headers
        .get("Set-cookie")
        ?.match(new RegExp(`${ADUSER_XSRF_COOKIE_NAME}=([^;,]+)`));
    const cookieValue = adUserXsrfCookieMatch ? adUserXsrfCookieMatch[1] : null;
    if (cookieValue) {
        const requestCookies = await cookies();
        requestCookies.set(ADUSER_XSRF_COOKIE_NAME, cookieValue, { path: "/" });
    }

    if (!res.ok) {
        if (res.status !== 404) {
            appLogger.httpError(`GET user from aduser failed.`, {
                method: "GET",
                url: res.url,
                status: res.status,
                statusText: res.statusText,
            });
        }

        return { success: false, statusCode: res.status };
    }
    const data = await res.json();
    return { success: true, data };
}

export type CreateUserInput = Readonly<{
    acceptedTerms: string;
}>;

export type ActionResult<T> = Readonly<{ ok: true; data: T }> | Readonly<{ ok: false; status: number }>;

type ApiUserResponse = Readonly<{
    id: number;
    uuid: string;
    acceptedTerms?: string;
    email?: string;
    verifiedEmail?: boolean;
    name?: string;
}>;

export async function createUser(input: CreateUserInput): Promise<ActionResult<ApiUserResponse>> {
    let oboToken: string;
    try {
        oboToken = await getAdUserOboToken();
    } catch {
        return { ok: false, status: 401 };
    }

    const response = await fetch(ADUSER_USER_URL, {
        method: "POST",
        body: JSON.stringify(input),
        headers: await getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
        cache: "no-store",
    });

    if (!response.ok) {
        appLogger.httpError("POST user to aduser failed.", {
            method: "POST",
            url: response.url,
            status: response.status,
            statusText: response.statusText,
        });
        return { ok: false, status: response.status };
    }

    const data = (await response.json()) as ApiUserResponse;
    return { ok: true, data };
}

export async function updateUser(user: User | undefined) {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch {
        return { success: false, statusCode: 401 };
    }

    const res = await fetch(ADUSER_USER_URL, {
        method: "PUT",
        body: JSON.stringify(user),
        credentials: "same-origin",
        headers: await getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    if (!res.ok) {
        appLogger.httpError(`PUT user to aduser failed.`, {
            method: "PUT",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        return { success: false, statusCode: res.status };
    }

    const data = await res.json();
    return { success: true, data };
}
