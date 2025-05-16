import VilkarStillingsannonser from "@/app/(artikler)/vilkar-stillingsannonser/VilkarStillingsannonser";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Vilkår for å publisere stillingsannonser",
};

export default function Page() {
    return <VilkarStillingsannonser />;
}
