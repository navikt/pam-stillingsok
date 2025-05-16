import SlikFungererSuperraskSoknad from "@/app/(artikler)/slik-fungerer-superrask-soknad/SlikFungererSuperraskSoknad";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Superrask søknad",
};

export default function Page() {
    return <SlikFungererSuperraskSoknad />;
}
