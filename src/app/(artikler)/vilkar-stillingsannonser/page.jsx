import { getMetadataTitle } from "@/app/layout";
import VilkarStillingsannonser from "@/app/(artikler)/vilkar-stillingsannonser/VilkarStillingsannonser";

export const metadata = {
    title: getMetadataTitle("Vilkår for å publisere stillingsannonser"),
};

export default function Page() {
    return <VilkarStillingsannonser />;
}
