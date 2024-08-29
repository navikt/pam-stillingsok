import { getMetadataTitle } from "@/app/layout";
import PersonvernSuperraskSoknad from "@/app/(artikler)/personvern-superrask-soknad/PersonvernSuperraskSoknad";

export const metadata = {
    title: getMetadataTitle("Personvernerklæring for superrask søknad"),
};

export default function Page() {
    return <PersonvernSuperraskSoknad />;
}
