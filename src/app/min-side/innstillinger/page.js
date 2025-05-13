import { ensureUserLoggedIn } from "@/app/min-side/_common/utils/ensureUserLoggedIn";
import InnstillingerPage from "@/app/min-side/innstillinger/components/InnstillingerPage";

export const metadata = {
    title: "Samtykker og innstillinger - arbeidsplassen.no",
};

export default async function Page() {
    await ensureUserLoggedIn();
    return <InnstillingerPage />;
}
