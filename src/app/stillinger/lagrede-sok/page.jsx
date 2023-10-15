import { cookies } from "next/headers";
import SavedSearchesWrapper from "../../../migrating/use-client/SavedSearchesWrapper";
import mockData from "./mock-data";
import LoginIsRequiredWrapper from "../../../migrating/use-client/LoginIsRequiredWrapper";
import UserConsentIsRequiredWrapper from "../../../migrating/use-client/UserConsentIsRequiredWrapper";

export const metadata = {
    title: "Lagrede søk - arbeidsplassen.no",
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
        return <LoginIsRequiredWrapper />;
    }

    if (!userExist) {
        return <UserConsentIsRequiredWrapper />;
    }

    return <SavedSearchesWrapper data={mockData} />;
}
