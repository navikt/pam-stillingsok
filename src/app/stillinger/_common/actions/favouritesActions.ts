"use server";

import {
    getAdUserDefaultAuthHeadersWithCsrfToken,
    getAdUserOboToken,
    getDefaultAuthHeaders,
} from "@/app/stillinger/_common/auth/auth";
import { logger } from "@navikt/next-logger";
import { revalidatePath } from "next/cache";
import { incrementAdUserRequests } from "@/metrics";
import { Favourite } from "@/app/stillinger/_common/types/Favorite";

const ADUSER_FAVOURITES_URL = `${process.env.PAMADUSER_URL}/api/v1/userfavouriteads`;

export async function getFavouritesAction() {
    const oboToken = await getAdUserOboToken();

    const res = await fetch(`${ADUSER_FAVOURITES_URL}?size=9999`, {
        method: "GET",
        headers: await getDefaultAuthHeaders(oboToken),
    });

    incrementAdUserRequests("get_favourites", res.ok);

    if (!res.ok) {
        logger.error(
            new Error(`GET favourites from aduser failed.`, {
                cause: { method: "GET", url: res.url, status: res.status, statusText: res.statusText },
            }),
        );
        throw new Error("Kunne ikke hente favoritter");
    }

    const data = await res.json();

    return data ? data.content : [];
}

export async function addFavouriteAction(favouriteAd: Favourite) {
    logger.info(new Error("Add favourite", { cause: { uuid: favouriteAd.uuid } }));
    const oboToken = await getAdUserOboToken();
    const res = await fetch(ADUSER_FAVOURITES_URL, {
        method: "POST",
        body: JSON.stringify({ favouriteAd }),
        headers: await getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    incrementAdUserRequests("create_favourite", res.ok);

    if (!res.ok) {
        logger.error(
            new Error(`POST favourite to aduser failed.`, {
                cause: { method: "POST", url: res.url, status: res.status, statusText: res.statusText },
            }),
        );
        throw new Error();
    }

    revalidatePath("/stillinger/favoritter");

    return res.json();
}

export async function deleteFavouriteAction(uuid: string) {
    logger.info(`DELETE favourite ${uuid}`);
    const oboToken = await getAdUserOboToken();
    const res = await fetch(`${ADUSER_FAVOURITES_URL}/${uuid}`, {
        method: "DELETE",
        headers: await getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    incrementAdUserRequests("delete_favourite", res.ok);

    if (!res.ok) {
        logger.error(
            new Error("DELETE favourite from aduser failed.", {
                cause: { method: "DELETE", url: res.url, status: res.status, statusText: res.statusText },
            }),
        );
        return { success: false };
    }

    revalidatePath("/stillinger/favoritter");
    return { success: true };
}
