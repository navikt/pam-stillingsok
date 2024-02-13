"use server";

export async function deleteFavouriteAction(uuid) {
    let response;
    try {
        // TODO: call real api /stillinger/api/v1/userfavouriteads/${uuid}
        response = await fetch(`${process.env.PAM_STILLINGSOK_URL}/api/user/favourites?uuid=${uuid}`, {
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
