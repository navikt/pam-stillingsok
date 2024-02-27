"use server";

import { cookies } from "next/headers";
import { getAdUserOboToken } from "../../_common/auth/auth";

export async function getFavouriteAction() {
    const oboToken = await getAdUserOboToken();

    const url = `${process.env.PAMADUSER_URL}/api/v1/userfavouriteads?size=9999`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oboToken}`,
        },
    });

    if (!res.ok) {
        console.error("Failed to fetch favourites from aduser");
        console.error(res.status);
        console.error(res);
        return;
        // return new Response(null, { status: res.status, headers: res.headers });
    }

    let data = await res.json();
    return data ? data.content : [];
}

export async function addFavouriteAction(favouriteAd) {
    const oboToken = await getAdUserOboToken();

    const url = `${process.env.PAMADUSER_URL}/api/v1/userfavouriteads`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ favouriteAd: favouriteAd }),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oboToken}`,
            cookie: `XSRF-TOKEN-ARBEIDSPLASSEN=${cookies().get("XSRF-TOKEN-ARBEIDSPLASSEN")?.value}`,
            "X-XSRF-TOKEN-ARBEIDSPLASSEN": cookies().get("XSRF-TOKEN-ARBEIDSPLASSEN")?.value,
        },
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

    const url = `${process.env.PAMADUSER_URL}/api/v1/userfavouriteads/${uuid}`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oboToken}`,
            cookie: `XSRF-TOKEN-ARBEIDSPLASSEN=${cookies().get("XSRF-TOKEN-ARBEIDSPLASSEN")?.value}`,
            "X-XSRF-TOKEN-ARBEIDSPLASSEN": cookies().get("XSRF-TOKEN-ARBEIDSPLASSEN")?.value,
        },
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
