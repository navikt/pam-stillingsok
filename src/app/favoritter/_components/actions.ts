"use server";

import { STILLINGSOK_URL } from "../../_common/environment";

export async function deleteFavouriteAction(uuid: string) {
    let response;
    try {
        // TODO: call real api /stillinger/api/v1/userfavouriteads/${uuid}
        response = await fetch(`${STILLINGSOK_URL}/api/user/favourites?uuid=${uuid}`, {
            method: "DELETE",
        });
    } catch (e) {
        console.log("Error deleting favourite", e);
        return { success: false };
    }
    if (response.status !== 200) {
        console.log("Error deleting favourite", response.status);
        return { success: false };
    }
    return { success: true };
}
