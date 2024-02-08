import FavouritesList from "./_components/FavouritesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";

export const metadata = {
    title: "Favoritter - arbeidsplassen.no",
};

// async function checkIfUserIsAuthenticated() {
//     const cookie = cookies().get("is-logged-in-hack");
//     return cookie && cookie.value === "true";
// }

async function checkIfUserExist() {
    return true;
}

export default async function Page() {
    const userExist = await checkIfUserExist();

    // TODO: Legg til sjekk på autentisering
    // const isAuthenticated = await checkIfUserIsAuthenticated();
    // if (!isAuthenticated) {
    //     return <LoginIsRequiredPage />;
    // }

    if (!userExist) {
        return <UserConsentIsRequired />;
    }

    return <FavouritesList />;
}
