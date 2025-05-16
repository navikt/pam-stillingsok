import VilkarSuperraskSoknad from "@/app/(artikler)/vilkar-superrask-soknad/VilkarSuperraskSoknad";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Vilkår for bruk av superrask søknad",
};

export default function Page() {
    return <VilkarSuperraskSoknad />;
}
