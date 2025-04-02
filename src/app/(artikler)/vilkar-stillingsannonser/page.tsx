import { getMetadataTitle } from "@/app/metadata";
import VilkarStillingsannonser from "@/app/(artikler)/vilkar-stillingsannonser/VilkarStillingsannonser";

export const metadata = {
    title: getMetadataTitle("Vilkår for å publisere stillingsannonser"),
};

export default function Page() {
    return <VilkarStillingsannonser />;
}
