"use server";

import {
    getAdUserDefaultAuthHeadersWithCsrfToken,
    getAdUserOboToken,
    getDefaultAuthHeaders,
} from "../../_common/auth/auth";

const ADUSER_FAVOURITES_URL = `${process.env.PAMADUSER_URL}/api/v1/userfavouriteads`;

export async function getFavouriteAction() {
    const oboToken = await getAdUserOboToken();

    const res = await fetch(`${ADUSER_FAVOURITES_URL}?size=9999`, {
        method: "GET",
        headers: getDefaultAuthHeaders(oboToken),
    });

    if (!res.ok) {
        console.error(`GET favourites from aduser failed. ${res.status} ${res.statusText}`);
        throw new Error();
    }

    let data = await res.json();

    return data ? data.content : [];
}

export async function addFavouriteAction(favouriteAd) {
    const oboToken = await getAdUserOboToken();

    const res = await fetch(ADUSER_FAVOURITES_URL, {
        method: "POST",
        body: JSON.stringify({ favouriteAd: favouriteAd }),
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    if (!res.ok) {
        console.error(`POST favourite to aduser failed. ${res.status} ${res.statusText}`);
        throw new Error();
    }

    return await res.json();
}

export async function deleteFavouriteAction(uuid) {
    const oboToken = await getAdUserOboToken();

    const res = await fetch(`${ADUSER_FAVOURITES_URL}/${uuid}`, {
        method: "DELETE",
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    if (!res.ok) {
        console.error(`DELETE favourite from aduser failed. ${res.status} ${res.statusText}`);
        throw new Error();
    }
}
