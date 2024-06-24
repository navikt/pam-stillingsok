import * as actions from "@/app/_common/actions";
import LoginIsRequiredPage from "@/app/_common/auth/components/LoginIsRequiredPage";
import FavouritesList from "./_components/FavouritesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";
import { getMetadataTitle } from "../layout";

export const metadata = {
    title: getMetadataTitle("Favoritter"),
    description:
        "Har du ikke tid til å lese annonsen akkurat nå, eller lyst til å søke senere når du kommer hjem? Med favoritter finner du raskt tilbake til annonsen.",
};

export default async function Page({ searchParams }) {
    const authenticated = await actions.checkIfAuthenticated();
    if (!authenticated.isAuthenticated) {
        return <LoginIsRequiredPage redirect="/stillinger/favoritter" />;
    }

    const agreementAccepted = await actions.checkIfUserAgreementIsAccepted();
    if (!agreementAccepted.userAgreementAccepted) {
        return <UserConsentIsRequired />;
    }

    const favourites = await actions.getFavouritesAction();
    if (searchParams.sort === "expires") {
        favourites.sort((a, b) => a.favouriteAd.expires.localeCompare(b.favouriteAd.expires));
    } else {
        favourites.sort((a, b) => b.favouriteAd.published.localeCompare(a.favouriteAd.published));
    }
    return <FavouritesList favourites={favourites} />;
}
