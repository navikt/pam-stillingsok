import { ReactElement } from "react";
import LoginIsRequiredPage from "@/app/(nonce)/stillinger/_common/auth/components/LoginIsRequiredPage";
import { Metadata } from "@/app/(nonce)/stillinger/stilling/_data/types";
import SavedSearchesList from "./_components/SavedSearchesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";
import { checkIfAuthenticated, checkIfUserAgreementIsAccepted, getAllSavedSearchesAction } from "../_common/actions";

export const metadata: Metadata = {
    title: "Lagrede søk",
    description:
        "Med lagrede søk kan du velge å motta e-postvarsler når det kommer nye treff, eller for å raskere søke neste gang.",
};

export default async function Page(): Promise<ReactElement> {
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
