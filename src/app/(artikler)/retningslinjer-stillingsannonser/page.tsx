import { getMetadataTitle } from "@/app/metadata";
import RetningslinjerStillingsannonser from "@/app/(artikler)/retningslinjer-stillingsannonser/RetningslinjerStillingsannonser";

export const metadata = {
    title: getMetadataTitle("Retningslinjer for innhold i annonser i Navs stillingsbase"),
};

export default function Page() {
    return <RetningslinjerStillingsannonser />;
}
