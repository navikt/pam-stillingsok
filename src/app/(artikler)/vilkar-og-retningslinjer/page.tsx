import VilkarOgRetningslinjer from "@/app/(artikler)/vilkar-og-retningslinjer/VilkarOgRetningslinjer";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Vilkår for å bruke arbeidsgivertjenestene",
};

export default function Page() {
    return <VilkarOgRetningslinjer />;
}
