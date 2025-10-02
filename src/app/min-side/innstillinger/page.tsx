import type { Metadata } from "next";
import InnstillingerPage from "@/app/min-side/innstillinger/components/InnstillingerPage";

export const metadata = {
    title: "Samtykker og innstillinger",
} satisfies Metadata;

export default async function Page() {
    return <InnstillingerPage />;
}
