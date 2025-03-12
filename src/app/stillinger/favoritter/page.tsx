import * as actions from "@/app/stillinger/_common/actions";
import LoginIsRequiredPage from "@/app/stillinger/_common/auth/components/LoginIsRequiredPage";
import { getUserPreferences } from "@/app/stillinger/_common/actions";
import { SortByEnumValues, isValidSortBy } from "@/app/stillinger/_common/utils/utilsts";
import { getMetadataTitle } from "@/app/metadata";
import { Metadata } from "@/app/stillinger/stilling/_data/types";
import FavouritesList from "./_components/FavouritesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: getMetadataTitle("Favoritter"),
        description:
            "Har du ikke tid til å lese annonsen akkurat nå, eller lyst til å søke senere når du kommer hjem? Med favoritter finner du raskt tilbake til annonsen.",
    };
}
interface PageProps {
    searchParams: {
        sortBy?: string;
    };
}

export default async function Page({ searchParams }: PageProps): Promise<JSX.Element> {
    const authenticated = await actions.checkIfAuthenticated();
    const userPreferences = await getUserPreferences();

    if (!authenticated.isAuthenticated) {
        return <LoginIsRequiredPage redirect="/stillinger/favoritter" />;
    }

    const agreementAccepted = await actions.checkIfUserAgreementIsAccepted();
    if (!agreementAccepted.userAgreementAccepted) {
        return <UserConsentIsRequired />;
    }

    let sortPreference: keyof typeof SortByEnumValues;

    // Determine sortPreference based on the valid conditions
    if (isValidSortBy(searchParams.sortBy)) {
        sortPreference = searchParams.sortBy;
    } else if (userPreferences.favouritesSortBy && isValidSortBy(userPreferences.favouritesSortBy)) {
        sortPreference = userPreferences.favouritesSortBy;
    } else {
        sortPreference = "FAVOURITE_DATE"; // Default
    }

    const favourites = await actions.getFavouritesAction();

    return <FavouritesList favourites={favourites} sortPreference={sortPreference} />;
}
