"use server";

import { appLogger } from "@/app/_common/logging/appLogger";
import { AdUser } from "@/app/_common/auth/aduserClient";
import { requiredEnv } from "@/app/_common/utils/requiredEnv";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { getAduserRequestHeaders } from "@/app/_common/auth/aduserAuth.server";

export async function getUser() {
    const ADUSER_USER_URL = `${requiredEnv("PAMADUSER_URL")}/api/v1/user`;

    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "none", baseHeaders });

    if (!auth.ok) {
        return { success: false, statusCode: auth.status };
    }

    const res = await fetch(ADUSER_USER_URL, {
        method: "GET",
        headers: auth.headers,
        cache: "no-store",
    });

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
    const data = (await res.json()) as AdUser;
    return { success: true, data };
}

export async function createUser(user: Partial<AdUser>) {
    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "required", baseHeaders });
    const ADUSER_USER_URL = `${requiredEnv("PAMADUSER_URL")}/api/v1/user`;

    if (!auth.ok) {
        return { success: false };
    }

    const res = await fetch(ADUSER_USER_URL, {
        method: "POST",
        body: JSON.stringify(user),
        headers: auth.headers,
    });

    if (!res.ok) {
        appLogger.httpError("POST user to aduser failed.", {
            method: "POST",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        return { success: false };
    }

    const data = (await res.json()) as AdUser;
    return { success: true, data };
}

export async function updateUser(user: AdUser | undefined) {
    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "required", baseHeaders });
    const ADUSER_USER_URL = `${requiredEnv("PAMADUSER_URL")}/api/v1/user`;

    if (!auth.ok) {
        return { success: false, statusCode: auth.status };
    }

    const res = await fetch(ADUSER_USER_URL, {
        method: "PUT",
        body: JSON.stringify(user ?? null),
        headers: auth.headers,
    });

    if (!res.ok) {
        appLogger.httpError("PUT user to aduser failed.", {
            method: "PUT",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        return { success: false, statusCode: res.status };
    }

    const data = (await res.json()) as AdUser;
    return { success: true, data };
}
