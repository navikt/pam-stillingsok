"use server";

export async function deleteFavouriteAction(uuid) {
    let response;
    try {
        // TODO: call aduser
        response = await fetch(`http://localhost:3003/stillinger/api/user/favourites?uuid=${uuid}`, {
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
