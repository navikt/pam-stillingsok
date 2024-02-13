"use server";

export async function deleteSavedSearchAction(uuid) {
    console.log("deleteSavedSearchAction", uuid);

    // TODO: call delete search `api/v1/savedsearches/${uuid}` when authentication is in place
    await new Promise((r) => setTimeout(r, 1000));

    return { success: true };
}

export async function updateSavedSearchAction(savedSearch) {
    console.log("saveSavedSearchAction", savedSearch);

    // TODO: call put `api/user/savedsearches/${existingSavedSearch.uuid}` when authentication is in place
    await new Promise((r) => setTimeout(r, 1000));

    return {
        success: true,
        data: savedSearch,
    };
}

export async function saveSavedSearchAction(savedSearch) {
    console.log("saveSavedSearchAction", savedSearch);

    // TODO: call post `api/user/savedsearches/` when authentication is in place
    await new Promise((r) => setTimeout(r, 1000));

    return {
        success: true,
        data: {
            ...savedSearch,
            uuid: new Date().getTime(),
        },
    };
}
