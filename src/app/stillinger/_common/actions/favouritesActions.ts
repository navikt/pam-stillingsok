"use server";

import {
    getAdUserDefaultAuthHeadersWithCsrfToken,
    getAdUserOboToken,
    getDefaultAuthHeaders,
} from "@/app/stillinger/_common/auth/auth";
import logger from "@/app/stillinger/_common/utils/logger";
import { revalidatePath } from "next/cache";
import { incrementAdUserRequests } from "@/metrics";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";

const ADUSER_FAVOURITES_URL = `${process.env.PAMADUSER_URL}/api/v1/userfavouriteads`;
type Favourite = Partial<AdDTO>;

export async function getFavouritesAction() {
    const oboToken = await getAdUserOboToken();

    const res = await fetch(`${ADUSER_FAVOURITES_URL}?size=9999`, {
        method: "GET",
        headers: await getDefaultAuthHeaders(oboToken),
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
    logger.info("Add favourite", { uuid: favouriteAd.id });
    const oboToken = await getAdUserOboToken();
    const res = await fetch(ADUSER_FAVOURITES_URL, {
        method: "POST",
        body: JSON.stringify({ favouriteAd }),
        headers: await getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    incrementAdUserRequests("create_favourite", res.ok);

    if (!res.ok) {
        logger.error(`POST favourite to aduser failed. ${res.status} ${res.statusText}`);
        throw new Error();
    }

    revalidatePath("/stillinger/favoritter");

    return res.json();
}

export async function deleteFavouriteAction(uuid: string) {
    logger.info("DELETE favourite ", { uuid });
    const oboToken = await getAdUserOboToken();
    const res = await fetch(`${ADUSER_FAVOURITES_URL}/${uuid}`, {
        method: "DELETE",
        headers: await getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    incrementAdUserRequests("delete_favourite", res.ok);

    if (!res.ok) {
        logger.error(`DELETE favourite from aduser failed. ${res.status} ${res.statusText}`);
        return { success: false };
    }

    revalidatePath("/stillinger/favoritter");
    return { success: true };
}
