"use server";

import logger from "@/app/stillinger/_common/utils/logger";
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
        headers: getDefaultAuthHeaders(oboToken),
    });

    incrementAdUserRequests("get_saved_searches", res.ok);

    if (!res.ok) {
        logger.error(`GET saved search failed. ${res.status} ${res.statusText}`);
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
        headers: getDefaultAuthHeaders(oboToken),
    });

    incrementAdUserRequests("get_saved_search", res.ok);

    if (!res.ok) {
        logger.error(`GET favourites failed. ${res.status} ${res.statusText}`);
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
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    incrementAdUserRequests("create_saved_search", res.ok);

    if (!res.ok) {
        logger.error(`POST saved search failed. ${res.status} ${res.statusText}`);
        return { success: false };
    }

    revalidatePath("/lagrede-sok");

    return {
        success: true,
        data: {
            ...savedSearch,
        },
    };
}

export async function updateSavedSearchAction(savedSearch: SavedSearch): Promise<ActionResponse<SavedSearch>> {
    logger.info("PUT SavedSearchAction", { uuid: savedSearch.uuid });

    const oboToken = await getAdUserOboToken();
    const res = await fetch(`${SAVED_SEARCH_URL}/${savedSearch.uuid}`, {
        method: "PUT",
        body: JSON.stringify(savedSearch),
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    incrementAdUserRequests("update_saved_search", res.ok);

    if (!res.ok) {
        logger.error(`PUT saved search failed. ${res.status} ${res.statusText}`);
        return { success: false };
    }

    revalidatePath("/lagrede-sok");

    return {
        success: true,
        data: {
            ...savedSearch,
        },
    };
}

export async function deleteSavedSearchAction(uuid: string): Promise<ActionResponse<SavedSearch>> {
    logger.info("DELETE saved search", { uuid });

    const oboToken = await getAdUserOboToken();

    const res = await fetch(`${SAVED_SEARCH_URL}/${uuid}`, {
        method: "DELETE",
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    incrementAdUserRequests("delete_saved_search", res.ok);

    if (!res.ok) {
        logger.error(`PUT saved search failed. ${res.status} ${res.statusText}`);
        return { success: false };
    }

    revalidatePath("/lagrede-sok");

    return { success: true };
}

export async function restartSavedSearchAction(
    uuid: string,
    savedSearch: SavedSearch,
): Promise<ActionResponse<SavedSearch>> {
    logger.info("RESTART saved search", { uuid });

    const oboToken = await getAdUserOboToken();

    const res = await fetch(`${SAVED_SEARCH_URL}/${uuid}`, {
        method: "PUT",
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
        body: JSON.stringify(savedSearch),
    });

    incrementAdUserRequests("restart_saved_search", res.ok);

    if (!res.ok) {
        logger.error(`PUT saved search failed. ${res.status} ${res.statusText}`);
        return { success: false };
    }

    revalidatePath("/lagrede-sok");

    const data = await res.json();

    return {
        success: true,
        data,
    };
}
