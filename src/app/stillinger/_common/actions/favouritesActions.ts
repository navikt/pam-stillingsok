"use server";

import { revalidatePath } from "next/cache";
import { incrementAdUserRequests } from "@/metrics";
import type { Favourite } from "@/app/stillinger/_common/types/Favorite";
import { appLogger } from "@/app/_common/logging/appLogger";
import { requiredEnv } from "@/app/_common/utils/requiredEnv";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { getAduserRequestHeaders } from "@/app/_common/auth/aduserAuth.server";

const getPamAduserBaseUrl = (): string => {
    return requiredEnv("PAMADUSER_URL").replace(/\/+$/, "");
};

const getSavedSearchUrl = (): string => {
    return `${getPamAduserBaseUrl()}/api/v1/userfavouriteads`;
};

type DeleteFavouriteResult = Readonly<{ success: boolean }>;

export async function getFavouritesAction() {
    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "none", baseHeaders });

    if (!auth.ok) {
        appLogger.info("GET favourites: mangler auth", { status: auth.status, reason: auth.reason });
        throw new Error("Kunne ikke hente favoritter");
    }

    const res = await fetch(`${getSavedSearchUrl()}?size=9999`, {
        method: "GET",
        headers: auth.headers,
        cache: "no-store",
    });

    incrementAdUserRequests("get_favourites", res.ok);

    if (!res.ok) {
        appLogger.httpError("GET favourites from aduser failed.", {
            method: "GET",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        throw new Error("Kunne ikke hente favoritter");
    }

    const json: unknown = await res.json();

    const maybePaged = json as { content?: [] } | null | undefined; // TODO: fikse type her
    return maybePaged?.content ?? [];
}

export async function addFavouriteAction(favouriteAd: Favourite): Promise<unknown> {
    appLogger.info("Add favourite", { uuid: favouriteAd.uuid });

    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "required", baseHeaders });

    if (!auth.ok) {
        appLogger.info("POST favourite: mangler auth/csrf", { status: auth.status, reason: auth.reason });
        throw new Error("Kunne ikke lagre favoritt");
    }

    const res = await fetch(getSavedSearchUrl(), {
        method: "POST",
        body: JSON.stringify({ favouriteAd }),
        headers: auth.headers,
    });

    incrementAdUserRequests("create_favourite", res.ok);

    if (!res.ok) {
        appLogger.httpError("POST favourite to aduser failed.", {
            method: "POST",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        throw new Error("Kunne ikke lagre favoritt");
    }

    revalidatePath("/stillinger/favoritter");

    const data: unknown = await res.json();
    return data;
}

export async function deleteFavouriteAction(uuid: string): Promise<DeleteFavouriteResult> {
    appLogger.info("DELETE favourite", { uuid });

    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "required", baseHeaders });

    if (!auth.ok) {
        appLogger.info("DELETE favourite: mangler auth/csrf", { status: auth.status, reason: auth.reason });
        return { success: false };
    }

    const res = await fetch(`${getSavedSearchUrl()}/${uuid}`, {
        method: "DELETE",
        headers: auth.headers,
    });

    incrementAdUserRequests("delete_favourite", res.ok);

    if (!res.ok) {
        appLogger.httpError("DELETE favourite from aduser failed.", {
            method: "DELETE",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        return { success: false };
    }

    revalidatePath("/stillinger/favoritter");
    return { success: true };
}
