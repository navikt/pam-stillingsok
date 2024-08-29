import { getMetadataTitle } from "@/app/layout";
import VilkarOgRetningslinjer from "@/app/(artikler)/vilkar-og-retningslinjer/VilkarOgRetningslinjer";

export const metadata = {
    title: getMetadataTitle("Vilkår for å bruke arbeidsgivertjenestene"),
};

export default function Page() {
    return <VilkarOgRetningslinjer />;
}
