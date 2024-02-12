import FavouritesList from "./_components/FavouritesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";
import { getMetadataTitle } from "../layout";
import { STILLINGSOK_URL } from "../_common/environment";

export const metadata = {
    title: getMetadataTitle("Favoritter"),
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
            `${STILLINGSOK_URL}/api/user/favourites?size=999&sortBy=${sortByInput}`,
            {
                method: "GET",
                cache: "no-store",
                credentials: "include",
            },
        );
        if (favouritesResponse.status !== 200) {
            // TODO: forbedre feilhåndtering
            return <div>En feil har skjedd... </div>;
        }
        const dataFromApi = await favouritesResponse.json();
        return dataFromApi.content;
    };

    let sortBy = props.searchParams.sortBy || "published";
    const favourites = await getFavourites(sortBy);

    return <FavouritesList favourites={favourites} sortBy={sortBy} />;
}
