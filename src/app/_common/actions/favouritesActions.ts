"use server";

import {
    getAdUserDefaultAuthHeadersWithCsrfToken,
    getAdUserOboToken,
    getDefaultAuthHeaders,
} from "@/app/_common/auth/auth";
import logger from "@/app/_common/utils/logger";
import { revalidatePath } from "next/cache";
import { incrementAdUserRequests } from "@/metrics";

const ADUSER_FAVOURITES_URL = `${process.env.PAMADUSER_URL}/api/v1/userfavouriteads`;
type Favourite = {
    uuid: string;
    source: string | undefined;
    reference: string | undefined;
    title: string | undefined;
    jobTitle?: string;
    status: string | undefined;
    applicationdue?: string;
    location?: string;
    employer?: string | null | undefined;
    published: string | Date | undefined;
    expires: string | Date | undefined;
};
export async function getFavouritesAction() {
    const oboToken = await getAdUserOboToken();

    const res = await fetch(`${ADUSER_FAVOURITES_URL}?size=9999`, {
        method: "GET",
        headers: getDefaultAuthHeaders(oboToken),
    });

    incrementAdUserRequests("get_favourites", res.ok);

    if (!res.ok) {
        logger.error(`GET favourites from aduser failed. ${res.status} ${res.statusText}`);
        throw new Error("Kunne ikke hente favoritter");
    }

    const data = await res.json();

    return data ? data.content : [];
}

export async function addFavouriteAction(favouriteAd: Favourite) {
    logger.info("Add favourite", { uuid: favouriteAd.uuid });
    const oboToken = await getAdUserOboToken();
    const res = await fetch(ADUSER_FAVOURITES_URL, {
        method: "POST",
        body: JSON.stringify({ favouriteAd }),
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    incrementAdUserRequests("create_favourite", res.ok);

    if (!res.ok) {
        logger.error(`POST favourite to aduser failed. ${res.status} ${res.statusText}`);
        throw new Error();
    }

    revalidatePath("/favoritter");

    return res.json();
}

export async function deleteFavouriteAction(uuid: string) {
    logger.info("DELETE favourite ", { uuid });
    const oboToken = await getAdUserOboToken();
    const res = await fetch(`${ADUSER_FAVOURITES_URL}/${uuid}`, {
        method: "DELETE",
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    incrementAdUserRequests("delete_favourite", res.ok);

    if (!res.ok) {
        logger.error(`DELETE favourite from aduser failed. ${res.status} ${res.statusText}`);
        return { success: false };
    }

    revalidatePath("/favoritter");
    return { success: true };
}
