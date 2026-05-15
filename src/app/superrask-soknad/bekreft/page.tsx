import { notFound } from "next/navigation";
import { Metadata } from "next";
import { confirmEmail } from "./confirmEmail";
import EpostBekreftetPage from "@/app/superrask-soknad/bekreft/EpostBekreftetPage";

export const metadata: Metadata = {
    title: "Superrask søknad",
    robots: "noindex",
};

type PageProps = {
    readonly searchParams: Promise<{
        readonly token?: string | string[];
    }>;
};

export default async function Page(props: PageProps) {
    const searchParams = await props.searchParams;
    const token = searchParams.token;

    if (typeof token !== "string" || token.trim().length === 0) {
        notFound();
    }

    // JWE tokens have 5 Base64URL parts separated by .
    const tokenPattern = /^([\w-]+\.){4}[\w-]+$/;

    if (!tokenPattern.test(token)) {
        throw Error("Invalid JWE token format");
    }

    const { applicationSentByLoggedInApplicant } = await confirmEmail(token);

    return <EpostBekreftetPage applicationSentByLoggedInApplicant={applicationSentByLoggedInApplicant} />;
}
