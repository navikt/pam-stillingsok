import type { Metadata } from "next";
import InnstillingerPage from "@/app/(nonce)/min-side/innstillinger/components/InnstillingerPage";

export const metadata: Metadata = {
    title: "Samtykker og innstillinger",
} satisfies Metadata;

export default async function Page() {
    return <InnstillingerPage />;
}
