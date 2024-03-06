"use server";

import logger from "@/app/_common/utils/logger";
import {
    getAdUserDefaultAuthHeadersWithCsrfToken,
    getAdUserOboToken,
    getDefaultAuthHeaders,
} from "@/app/_common/auth/auth";
import { revalidatePath } from "next/cache";

const SAVED_SEARCH_URL = `${process.env.PAMADUSER_URL}/api/v1/savedsearches`;

export async function getAllSavedSearchesAction() {
    logger.info("GET saved search");

    const oboToken = await getAdUserOboToken();
    const res = await fetch(`${SAVED_SEARCH_URL}?size=999&sort=updated,desc`, {
        method: "GET",
        headers: getDefaultAuthHeaders(oboToken),
    });

    if (!res.ok) {
        logger.error(`GET saved search failed. ${res.status} ${res.statusText}`);
        throw new Error("Kunne ikke hente lagrede søk");
    }

    let data = await res.json();
    return data ? data.content : [];
}

export async function getSavedSearchAction(uuid) {
    logger.info("GET saved search");

    const oboToken = await getAdUserOboToken();
    const res = await fetch(`${SAVED_SEARCH_URL}/${uuid}`, {
        method: "GET",
        headers: getDefaultAuthHeaders(oboToken),
    });

    if (!res.ok) {
        logger.error(`GET favourites failed. ${res.status} ${res.statusText}`);
        return { success: false, statusCode: res.status };
    }

    let data = await res.json();
    return { success: true, data };
}

export async function saveSavedSearchAction(savedSearch) {
    logger.info("POST saved search");

    const oboToken = await getAdUserOboToken();
    const res = await fetch(SAVED_SEARCH_URL, {
        method: "POST",
        body: JSON.stringify(savedSearch),
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    if (!res.ok) {
        logger.error(`POST saved search failed. ${res.status} ${res.statusText}`);
        return { success: false };
    }

    revalidatePath("/lagrede-sok");

    return {
        success: true,
        data: {
            ...savedSearch,
            uuid: new Date().getTime(),
        },
    };
}

export async function updateSavedSearchAction(savedSearch) {
    logger.info("PUT SavedSearchAction", { uuid: savedSearch.uuid });

    const oboToken = await getAdUserOboToken();
    const res = await fetch(`${SAVED_SEARCH_URL}/${savedSearch.uuid}`, {
        method: "PUT",
        body: JSON.stringify(savedSearch),
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    if (!res.ok) {
        logger.error(`PUT saved search failed. ${res.status} ${res.statusText}`);
        return { success: false };
    }

    revalidatePath("/lagrede-sok");

    return {
        success: true,
        data: {
            ...savedSearch,
            uuid: new Date().getTime(),
        },
    };
}

export async function deleteSavedSearchAction(uuid) {
    logger.info("DELETE saved search", { uuid });

    const oboToken = await getAdUserOboToken();

    const res = await fetch(`${SAVED_SEARCH_URL}/${uuid}`, {
        method: "DELETE",
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    if (!res.ok) {
        logger.error(`PUT saved search failed. ${res.status} ${res.statusText}`);
        return { success: false };
    }

    revalidatePath("/lagrede-sok");

    return { success: true };
}
