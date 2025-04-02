import { getMetadataTitle } from "@/app/metadata";
import VilkarSuperraskSoknad from "@/app/(artikler)/vilkar-superrask-soknad/VilkarSuperraskSoknad";

export const metadata = {
    title: getMetadataTitle("Vilkår for bruk av superrask søknad"),
};

export default function Page() {
    return <VilkarSuperraskSoknad />;
}
