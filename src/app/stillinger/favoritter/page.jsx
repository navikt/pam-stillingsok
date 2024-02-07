import { cookies } from "next/headers";
import mockData from "../api/v1/userfavouriteads/mock-data";
import LoginIsRequiredPage from "../../_common/auth/components/LoginIsRequiredPage";
import FavouritesList from "./_components/FavouritesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";

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
        return <LoginIsRequiredPage />;
    }

    if (!userExist) {
        return <UserConsentIsRequired />;
    }
    return <FavouritesList data={mockData} />;
}
