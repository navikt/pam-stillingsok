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
        console.error("Failed to fetch favourites from aduser");
        console.error(res.status);
        console.error(res);
        return;
    }

    let data = await res.json();
    return data ? data.content : [];
}

export async function addFavouriteAction(favouriteAd) {
    const oboToken = await getAdUserOboToken();

    const url = `${process.env.PAMADUSER_URL}/api/v1/userfavouriteads`;
    const res = await fetch(ADUSER_FAVOURITES_URL, {
        method: "POST",
        body: JSON.stringify({ favouriteAd: favouriteAd }),
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    if (!res.ok) {
        console.error("Failed to add favourite to aduser");
        console.error(res.status);
        throw new Error("Error adding favourite");
    }

    return await res.json();
}

export async function deleteFavouriteAction(uuid) {
    const oboToken = await getAdUserOboToken();

    const res = await fetch(ADUSER_FAVOURITES_URL, {
        method: "DELETE",
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    if (!res.ok) {
        console.error("Failed to delete favourite from aduser");
        console.error(res.status);
        return { success: false };
    }

    return { success: true };

    // let response;
    // try {
    //     // TODO: call aduser
    //     response = await fetch(`http://localhost:3003/stillinger/api/user/favourites?uuid=${uuid}`, {
    //         method: "DELETE",
    //     });
    // } catch (e) {
    //     console.log("Error deleting favourite", e);
    //     return { success: false };
    // }
    // if (response.status !== 200) {
    //     console.log("Error deleting favourite", response.status);
    //     return { success: false };
    // }
    // return { success: true };
}
