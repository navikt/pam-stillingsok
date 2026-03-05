"use server";

import { revalidatePath } from "next/cache";
import { incrementAdUserRequests } from "@/metrics";
import { ActionResponse } from "@/app/stillinger/_common/actions/types";
import { appLogger } from "@/app/_common/logging/appLogger";
import { getAduserRequestHeaders } from "@/app/_common/auth/aduserAuth.server";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { validate as isValidUUID } from "uuid";

const SAVED_SEARCH_URL = `${process.env.PAMADUSER_URL}/api/v1/savedsearches`;

export interface SavedSearch {
    id?: number;
    uuid?: string;
    title?: string;
    status?: string;
    searchQuery?: string;
    updated?: string;
    expires?: string;
    notifyType?: string;
    duration?: number;
}

export interface GetSavedSearchResponse extends ActionResponse<SavedSearch> {
    statusCode?: number;
}

export async function getAllSavedSearchesAction(): Promise<SavedSearch[]> {
    appLogger.info("GET saved search");

    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "none", baseHeaders });

    if (!auth.ok) {
        throw new Error("Kunne ikke hente lagrede søk");
    }

    const res = await fetch(`${SAVED_SEARCH_URL}?size=999&sort=updated,desc`, {
        method: "GET",
        headers: auth.headers,
        cache: "no-store",
    });

    incrementAdUserRequests("get_saved_searches", res.ok);

    if (!res.ok) {
        appLogger.httpError("GET saved search failed.", {
            method: "GET",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        throw new Error("Kunne ikke hente lagrede søk");
    }

    // TODO: fiks type her
    const data: unknown = await res.json();
    const maybePaged = data as { content?: SavedSearch[] } | null | undefined;
    return maybePaged?.content ?? [];
}

export async function getSavedSearchAction(uuid: string): Promise<GetSavedSearchResponse> {
    appLogger.info("GET saved search");

    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "none", baseHeaders });

    if (!auth.ok) {
        return { success: false, statusCode: auth.status };
    }

    const res = await fetch(`${SAVED_SEARCH_URL}/${uuid}`, {
        method: "GET",
        headers: auth.headers,
        cache: "no-store",
    });

    incrementAdUserRequests("get_saved_search", res.ok);

    if (!res.ok) {
        appLogger.httpError("GET saved search failed.", {
            method: "GET",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        return { success: false, statusCode: res.status };
    }

    // TODO: fiks type her
    const data: unknown = await res.json();
    return { success: true, data: data as SavedSearch };
}

export async function saveSavedSearchAction(savedSearch: SavedSearch): Promise<ActionResponse<SavedSearch>> {
    appLogger.info("POST saved search");

    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "required", baseHeaders });

    if (!auth.ok) {
        return { success: false };
    }

    const res = await fetch(SAVED_SEARCH_URL, {
        method: "POST",
        body: JSON.stringify(savedSearch),
        headers: auth.headers,
    });

    incrementAdUserRequests("create_saved_search", res.ok);

    if (!res.ok) {
        appLogger.httpError("POST saved search failed.", {
            method: "POST",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        return { success: false };
    }

    revalidatePath("/stillinger/lagrede-sok");

    return { success: true, data: { ...savedSearch } };
}

export async function updateSavedSearchAction(savedSearch: SavedSearch): Promise<ActionResponse<SavedSearch>> {
    appLogger.info(`PUT SavedSearchAction uuid:${savedSearch.uuid ?? "unknown"}`);

    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "required", baseHeaders });

    if (!auth.ok) {
        return { success: false };
    }

    const uuid = savedSearch.uuid ?? "";
    if (!uuid) {
        return { success: false };
    }

    const res = await fetch(`${SAVED_SEARCH_URL}/${uuid}`, {
        method: "PUT",
        body: JSON.stringify(savedSearch),
        headers: auth.headers,
    });

    incrementAdUserRequests("update_saved_search", res.ok);

    if (!res.ok) {
        appLogger.httpError("PUT saved search failed.", {
            method: "PUT",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        return { success: false };
    }

    revalidatePath("/stillinger/lagrede-sok");
    return { success: true, data: { ...savedSearch } };
}

export async function deleteSavedSearchAction(uuid: string): Promise<ActionResponse<SavedSearch>> {
    appLogger.info(`DELETE saved search: ${uuid}`);

    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "required", baseHeaders });

    if (!auth.ok) {
        return { success: false };
    }

    const res = await fetch(`${SAVED_SEARCH_URL}/${uuid}`, {
        method: "DELETE",
        headers: auth.headers,
    });

    incrementAdUserRequests("delete_saved_search", res.ok);

    if (!res.ok) {
        appLogger.httpError("DELETE saved search failed.", {
            method: "DELETE",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        return { success: false };
    }

    revalidatePath("/stillinger/lagrede-sok");
    return { success: true };
}

export async function restartSavedSearchAction(
    uuid: string,
    savedSearch: SavedSearch,
): Promise<ActionResponse<SavedSearch>> {
    appLogger.info(`RESTART saved search: ${uuid}`);

    if (isValidUUID(uuid)) {
        return { success: false };
    }
    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "required", baseHeaders });

    if (!auth.ok) {
        return { success: false };
    }

    const res = await fetch(`${SAVED_SEARCH_URL}/${uuid}`, {
        method: "PUT",
        headers: auth.headers,
        body: JSON.stringify(savedSearch),
    });

    incrementAdUserRequests("restart_saved_search", res.ok);

    if (!res.ok) {
        appLogger.httpError("PUT saved search failed.", {
            method: "PUT",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        return { success: false };
    }

    revalidatePath("/stillinger/lagrede-sok");

    // TODO: fiks type her
    const data: unknown = await res.json();
    return { success: true, data: data as SavedSearch };
}
