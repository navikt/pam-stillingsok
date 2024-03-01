import { cookies } from "next/headers";
import SavedSearchesList from "./_components/SavedSearchesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";
import { getMetadataTitle } from "../layout";
import * as actions from "@/app/_common/actions";
import LoginIsRequiredPage from "@/app/_common/auth/components/LoginIsRequiredPage";

export const metadata = {
    title: getMetadataTitle("Lagrede søk"),
    description:
        "Med lagrede søk kan du velge å motta e-postvarsler når det kommer nye treff, eller for å raskere søke neste gang.",
};

async function checkIfUserExist() {
    // TODO: sjekk om bruker har samtykket
    return true;
}

export default async function Page() {
    const authenticated = await actions.checkIfAuthenticated();
    if (!authenticated.isAuthenticated) {
        return <LoginIsRequiredPage />;
    }

    const userExist = await checkIfUserExist();
    if (!userExist) {
        return <UserConsentIsRequired />;
    }

    return <SavedSearchesList data={await actions.getSavedSearchesAction()} />;
}
