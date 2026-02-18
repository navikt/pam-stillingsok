"use server";

import { logger } from "@navikt/next-logger";
import {
    getAdUserDefaultAuthHeadersWithCsrfToken,
    getAdUserOboToken,
    getDefaultAuthHeaders,
} from "@/app/stillinger/_common/auth/auth";
import { revalidatePath } from "next/cache";
import { incrementAdUserRequests } from "@/metrics";
import { ActionResponse } from "@/app/stillinger/_common/actions/types";

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
    logger.info("GET saved search");

    const oboToken = await getAdUserOboToken();
    const res = await fetch(`${SAVED_SEARCH_URL}?size=999&sort=updated,desc`, {
        method: "GET",
        headers: await getDefaultAuthHeaders(oboToken),
    });

    incrementAdUserRequests("get_saved_searches", res.ok);

    if (!res.ok) {
        logger.error(
            new Error(`GET saved search failed.`, {
                cause: { method: "GET", url: res.url, status: res.status, statusText: res.statusText },
            }),
        );
        throw new Error("Kunne ikke hente lagrede søk");
    }

    const data = await res.json();
    return data ? data.content : [];
}

export async function getSavedSearchAction(uuid: string): Promise<GetSavedSearchResponse> {
    logger.info("GET saved search");

    const oboToken = await getAdUserOboToken();
    const res = await fetch(`${SAVED_SEARCH_URL}/${uuid}`, {
        method: "GET",
        headers: await getDefaultAuthHeaders(oboToken),
    });

    incrementAdUserRequests("get_saved_search", res.ok);

    if (!res.ok) {
        logger.error(
            new Error(`GET favourites failed`, {
                cause: { method: "GET", url: res.url, status: res.status, statusText: res.statusText },
            }),
        );
        return { success: false, statusCode: res.status };
    }

    const data = await res.json();
    return { success: true, data };
}

export async function saveSavedSearchAction(savedSearch: SavedSearch): Promise<ActionResponse<SavedSearch>> {
    logger.info("POST saved search");

    const oboToken = await getAdUserOboToken();
    const res = await fetch(SAVED_SEARCH_URL, {
        method: "POST",
        body: JSON.stringify(savedSearch),
        headers: await getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    incrementAdUserRequests("create_saved_search", res.ok);

    if (!res.ok) {
        logger.error(
            new Error(`POST saved search failed.`, {
                cause: { method: "POST", url: res.url, status: res.status, statusText: res.statusText },
            }),
        );
        return { success: false };
    }

    revalidatePath("/stillinger/lagrede-sok");

    return {
        success: true,
        data: {
            ...savedSearch,
        },
    };
}

export async function updateSavedSearchAction(savedSearch: SavedSearch): Promise<ActionResponse<SavedSearch>> {
    logger.info(`PUT SavedSearchAction uuid:${savedSearch.uuid}`);

    const oboToken = await getAdUserOboToken();
    const res = await fetch(`${SAVED_SEARCH_URL}/${savedSearch.uuid}`, {
        method: "PUT",
        body: JSON.stringify(savedSearch),
        headers: await getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    incrementAdUserRequests("update_saved_search", res.ok);

    if (!res.ok) {
        logger.error(
            new Error(`PUT saved search failed.`, {
                cause: { method: "PUT", url: res.url, status: res.status, statusText: res.statusText },
            }),
        );
        return { success: false };
    }

    revalidatePath("/stillinger/lagrede-sok");

    return {
        success: true,
        data: {
            ...savedSearch,
        },
    };
}

export async function deleteSavedSearchAction(uuid: string): Promise<ActionResponse<SavedSearch>> {
    logger.info(`DELETE saved search: ${uuid}`);

    const oboToken = await getAdUserOboToken();

    const res = await fetch(`${SAVED_SEARCH_URL}/${uuid}`, {
        method: "DELETE",
        headers: await getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    incrementAdUserRequests("delete_saved_search", res.ok);

    if (!res.ok) {
        logger.error(
            new Error(`PUT saved search failed.`, {
                cause: { method: "PUT", url: res.url, status: res.status, statusText: res.statusText },
            }),
        );
        return { success: false };
    }

    revalidatePath("/stillinger/lagrede-sok");

    return { success: true };
}

export async function restartSavedSearchAction(
    uuid: string,
    savedSearch: SavedSearch,
): Promise<ActionResponse<SavedSearch>> {
    logger.info(`RESTART saved search: ${uuid}`);

    const oboToken = await getAdUserOboToken();

    const res = await fetch(`${SAVED_SEARCH_URL}/${uuid}`, {
        method: "PUT",
        headers: await getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
        body: JSON.stringify(savedSearch),
    });

    incrementAdUserRequests("restart_saved_search", res.ok);

    if (!res.ok) {
        logger.error(
            new Error(`PUT saved search failed.`, {
                cause: { method: "PUT", url: res.url, status: res.status, statusText: res.statusText },
            }),
        );
        return { success: false };
    }

    revalidatePath("/stillinger/lagrede-sok");

    const data = await res.json();

    return {
        success: true,
        data,
    };
}
