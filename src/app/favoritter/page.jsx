import FavouritesList from "./_components/FavouritesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";
import { getMetadataTitle } from "../layout";
import * as actions from "@/app/_common/actions";
import LoginIsRequiredPage from "@/app/_common/auth/components/LoginIsRequiredPage";

export const metadata = {
    title: getMetadataTitle("Favoritter"),
    description:
        "Har du ikke tid til å lese annonsen akkurat nå, eller lyst til å søke senere når du kommer hjem? Med favoritter finner du raskt tilbake til annonsen.",
};

async function checkIfUserExist() {
    // TODO: sjekk om bruker har samtykket
    return true;
}

export default async function Page(props) {
    const authenticated = await actions.checkIfAuthenticated();
    if (!authenticated.isAuthenticated) {
        return <LoginIsRequiredPage />;
    }

    const userExist = await checkIfUserExist();
    if (!userExist) {
        return <UserConsentIsRequired />;
    }

    let sortBy = props.searchParams.sortBy || "published";
    const favourites = await actions.getFavouritesAction(sortBy);
    return <FavouritesList favourites={favourites} />;
}
