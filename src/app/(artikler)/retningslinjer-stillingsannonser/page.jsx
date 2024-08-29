import RetningslinjerStillingsannonser from "@/app/(artikler)/retningslinjer-stillingsannonser/RetningslinjerStillingsannonser";
import { getMetadataTitle } from "@/app/layout";

export const metadata = {
    title: getMetadataTitle("Retningslinjer for innhold i annonser i NAVs stillingsbase"),
};

export default function Page() {
    return <RetningslinjerStillingsannonser />;
}
