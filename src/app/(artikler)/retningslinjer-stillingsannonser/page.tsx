import RetningslinjerStillingsannonser from "@/app/(artikler)/retningslinjer-stillingsannonser/RetningslinjerStillingsannonser";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Retningslinjer for innhold i annonser i Navs stillingsbase",
};

export default function Page() {
    return <RetningslinjerStillingsannonser />;
}
