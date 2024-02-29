import { cookies } from "next/headers";
import SavedSearchesList from "./_components/SavedSearchesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";
import { getMetadataTitle } from "../layout";
import * as actions from "@/app/_common/actions";

export const metadata = {
    title: getMetadataTitle("Lagrede søk"),
    description:
        "Med lagrede søk kan du velge å motta e-postvarsler når det kommer nye treff, eller for å raskere søke neste gang.",
};

async function checkIfUserIsAuthenticated() {
    // Todo: Replace this hack
    const cookie = cookies().get("is-logged-in-hack");
    return cookie && cookie.value === "true";
}

async function checkIfUserExist() {
    return true;
}

export default async function Page() {
    const isAuthenticated = await checkIfUserIsAuthenticated();
    const userExist = await checkIfUserExist();

    // TODO: Legg til sjekk på autentisering
    // if (!isAuthenticated) {
    //     return <LoginIsRequiredPage />;
    // }

    if (!userExist) {
        return <UserConsentIsRequired />;
    }

    return <SavedSearchesList data={await actions.getSavedSearchesAction()} />;
}
