import { getMetadataTitle } from "@/app/metadata";
import SlikFungererSuperraskSoknad from "@/app/(artikler)/slik-fungerer-superrask-soknad/SlikFungererSuperraskSoknad";

export const metadata = {
    title: getMetadataTitle("Superrask søknad"),
};

export default function Page() {
    return <SlikFungererSuperraskSoknad />;
}
