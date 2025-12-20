import * as actions from "@/app/(nonce)/stillinger/_common/actions";
import LoginIsRequiredPage from "@/app/(nonce)/stillinger/_common/auth/components/LoginIsRequiredPage";
import { Metadata } from "@/app/(nonce)/stillinger/stilling/_data/types";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";
import FavouritesListWrapper from "@/app/(nonce)/stillinger/favoritter/_components/FavouritesListWrapper";
import { getSortPreference } from "@/app/(nonce)/stillinger/_common/utils/getSortPreference";
import { getFilterPreference } from "@/app/(nonce)/stillinger/_common/utils/getFilterPreference";

export const metadata: Metadata = {
    title: "Favoritter",
    description:
        "Har du ikke tid til å lese annonsen akkurat nå, eller lyst til å søke senere når du kommer hjem? Med favoritter finner du raskt tilbake til annonsen.",
};

interface PageProps {
    searchParams: Promise<{
        sortBy?: string;
    }>;
}

export default async function Page(props: PageProps): Promise<JSX.Element> {
    const searchParams = await props.searchParams;
    const authenticated = await actions.checkIfAuthenticated();

    if (!authenticated.isAuthenticated) {
        return <LoginIsRequiredPage redirect="/stillinger/favoritter" />;
    }

    const agreementAccepted = await actions.checkIfUserAgreementIsAccepted();
    if (!agreementAccepted.userAgreementAccepted) {
        return <UserConsentIsRequired />;
    }

    const filterPreference = getFilterPreference({
        searchParams,
    });

    const sortPreference = getSortPreference({
        searchParams,
    });

    const favourites = await actions.getFavouritesAction();

    return (
        <FavouritesListWrapper
            favourites={favourites}
            sortPreference={sortPreference}
            filterPreference={filterPreference}
        />
    );
}
