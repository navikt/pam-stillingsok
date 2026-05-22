import type { Metadata } from "next";
import type React from "react";
import { checkIfAuthenticated } from "@/app/stillinger/_common/actions";
import LoginIsRequiredPage from "@/app/stillinger/_common/auth/components/LoginIsRequiredPage";
import { getApplications } from "@/app/superrask-soknad/mine-soknader/_actions/applicationActions";
import MineSoknaderPage from "@/app/superrask-soknad/mine-soknader/_components/MineSoknaderPage";

export const metadata: Metadata = {
    title: "Mine søknader",
    robots: "noindex",
};

export default async function Page(): Promise<React.JSX.Element> {
    const authenticated = await checkIfAuthenticated();

    if (!authenticated.isAuthenticated) {
        return <LoginIsRequiredPage redirect="/superrask-soknad/mine-soknader" />;
    }

    const applications = await getApplications();

    return <MineSoknaderPage applications={applications} />;
}
