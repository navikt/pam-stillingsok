import * as actions from "@/app/_common/actions";
import LoginIsRequiredPage from "@/app/_common/auth/components/LoginIsRequiredPage";
import SavedSearchesList from "./_components/SavedSearchesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";
import { getMetadataTitle } from "../layout";

export const metadata = {
    title: getMetadataTitle("Lagrede søk"),
    description:
        "Med lagrede søk kan du velge å motta e-postvarsler når det kommer nye treff, eller for å raskere søke neste gang.",
};

export default async function Page() {
    const authenticated = await actions.checkIfAuthenticated();
    if (!authenticated.isAuthenticated) {
        return <LoginIsRequiredPage redirect="/stillinger/lagrede-sok" />;
    }

    const agreementAccepted = await actions.checkIfUserAgreementIsAccepted();
    if (!agreementAccepted.userAgreementAccepted) {
        return <UserConsentIsRequired />;
    }

    return <SavedSearchesList data={await actions.getAllSavedSearchesAction()} />;
}
