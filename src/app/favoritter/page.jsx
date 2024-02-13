import FavouritesList from "./_components/FavouritesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";
import { getMetadataTitle } from "../layout";

export const metadata = {
    title: getMetadataTitle("Favoritter"),
    description:
        "Har du ikke tid til å lese annonsen akkurat nå, eller lyst til å søke senere når du kommer hjem? Med favoritter finner du raskt tilbake til annonsen.",
};

// async function checkIfUserIsAuthenticated() {
//     const cookie = cookies().get("is-logged-in-hack");
//     return cookie && cookie.value === "true";
// }

async function checkIfUserExist() {
    return true;
}

export default async function Page(props) {
    // TODO: Legg til sjekk på autentisering
    // const isAuthenticated = await checkIfUserIsAuthenticated();
    // if (!isAuthenticated) {
    //     return <LoginIsRequiredPage />;
    // }

    const userExist = await checkIfUserExist();
    if (!userExist) {
        return <UserConsentIsRequired />;
    }

    const getFavourites = async (sortByInput) => {
        const favouritesResponse = await fetch(
            // todo: call aduser
            `http://localhost:3003/stillinger/api/user/favourites?size=999&sortBy=${sortByInput}`,
            {
                method: "GET",
                cache: "no-store",
                credentials: "include",
            },
        );
        if (favouritesResponse.status !== 200) {
            throw new Error("Failed to fetch favourites");
        }
        const dataFromApi = await favouritesResponse.json();
        return dataFromApi.content;
    };

    let sortBy = props.searchParams.sortBy || "published";
    const favourites = await getFavourites(sortBy);

    return <FavouritesList favourites={favourites} />;
}
