import { ensureUserLoggedIn } from "@/app/min-side/_common/utils/ensureUserLoggedIn";
import InnstillingerPage from "@/app/min-side/innstillinger/components/InnstillingerPage";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Samtykker og innstillinger",
};

export default async function Page() {
    await ensureUserLoggedIn();
    return <InnstillingerPage />;
}
