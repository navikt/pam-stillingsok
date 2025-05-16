import PersonvernSuperraskSoknad from "@/app/(artikler)/personvern-superrask-soknad/PersonvernSuperraskSoknad";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Personvernerklæring for superrask søknad",
};

export default function Page() {
    return <PersonvernSuperraskSoknad />;
}
