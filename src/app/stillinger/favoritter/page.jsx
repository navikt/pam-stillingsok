import { cookies } from "next/headers";
import FavouritesWrapper from "../../../migrating/use-client/FavouritesWrapper";
import mockData from "../api/v1/userfavouriteads/mock-data";
import LoginIsRequiredWrapper from "../../../migrating/use-client/LoginIsRequiredWrapper";
import UserConsentIsRequiredWrapper from "../../../migrating/use-client/UserConsentIsRequiredWrapper";

export const metadata = {
    title: "Favoritter - arbeidsplassen.no",
};

async function checkIfUserIsAuthenticated() {
    const cookie = cookies().get("is-logged-in-hack");
    return cookie && cookie.value === "true";
}

async function checkIfUserExist() {
    return true;
}

export default async function Page() {
    const isAuthenticated = await checkIfUserIsAuthenticated();
    const userExist = await checkIfUserExist();

    if (!isAuthenticated) {
        return <LoginIsRequiredWrapper />;
    }

    if (!userExist) {
        return <UserConsentIsRequiredWrapper />;
    }
    return <FavouritesWrapper data={mockData} />;
}
