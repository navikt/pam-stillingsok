import * as actions from "@/app/_common/actions";
import LoginIsRequiredPage from "@/app/_common/auth/components/LoginIsRequiredPage";
import { getUserPreferences } from "@/app/_common/actions";
import { SortByEnum } from "@/app/_common/utils/utils";
import FavouritesList from "./_components/FavouritesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";
import { getMetadataTitle } from "../layout";

export const metadata = {
    title: getMetadataTitle("Favoritter"),
    description:
        "Har du ikke tid til å lese annonsen akkurat nå, eller lyst til å søke senere når du kommer hjem? Med favoritter finner du raskt tilbake til annonsen.",
};

export default async function Page(props) {
    const authenticated = await actions.checkIfAuthenticated();
    const userPreferences = await getUserPreferences();

    if (!authenticated.isAuthenticated) {
        return <LoginIsRequiredPage redirect="/stillinger/favoritter" />;
    }

    const agreementAccepted = await actions.checkIfUserAgreementIsAccepted();
    if (!agreementAccepted.userAgreementAccepted) {
        return <UserConsentIsRequired />;
    }

    // eslint-disable-next-line
    const sortPreference = props.searchParams.sortBy || userPreferences.favouritesSortBy || SortByEnum.FAVOURITE_DATE;
    const favourites = await actions.getFavouritesAction();
    return <FavouritesList favourites={favourites} sortPreference={sortPreference} />;
}
