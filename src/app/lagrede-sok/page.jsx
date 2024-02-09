import { cookies } from "next/headers";
import mockData from "./mock-data";
import LoginIsRequiredPage from "../_common/auth/components/LoginIsRequiredPage";
import SavedSearchesList from "./_components/SavedSearchesList";
import UserConsentIsRequired from "./_components/UserConsentIsRequired";
import { getTitle } from "../stilling/[id]/_components/getMetaData";

export const metadata = {
    title: getTitle("Lagrede søk"),
};

async function checkIfUserIsAuthenticated() {
    // Todo: Replace this hack
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

    return <SavedSearchesList data={mockData} />;
}
