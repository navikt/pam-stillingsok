"use server";

export async function deleteSavedSearchAction(uuid) {
    console.log("deleteSavedSearchAction", uuid);

    // TODO: call delete search `api/v1/savedsearches/${uuid}` when authentication is in place
    await new Promise((r) => setTimeout(r, 1000));

    return { success: true };
}

export async function editSavedSearchAction(savedSearch) {
    console.log("editSavedSearchAction", savedSearch);

    // TODO: call post `api/user/savedsearches/` when authentication is in place
    await new Promise((r) => setTimeout(r, 1000));

    return { success: true };
}
