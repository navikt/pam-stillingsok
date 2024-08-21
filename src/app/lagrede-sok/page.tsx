import LoginIsRequiredPage from "@/app/_common/auth/components/LoginIsRequiredPage";
import SavedSearchesList from "./_components/SavedSearchesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";
import { getMetadataTitle } from "../layout";
import { checkIfAuthenticated, checkIfUserAgreementIsAccepted, getAllSavedSearchesAction } from "../_common/actions";

export const metadata = {
    title: getMetadataTitle("Lagrede søk"),
    description:
        "Med lagrede søk kan du velge å motta e-postvarsler når det kommer nye treff, eller for å raskere søke neste gang.",
};

export default async function Page() {
    const authenticated = await checkIfAuthenticated();
    if (!authenticated.isAuthenticated) {
        return <LoginIsRequiredPage redirect="/stillinger/lagrede-sok" />;
    }

    const agreementAccepted = await checkIfUserAgreementIsAccepted();
    if (!agreementAccepted.userAgreementAccepted) {
        return <UserConsentIsRequired />;
    }

    return <SavedSearchesList data={await getAllSavedSearchesAction()} />;
}
