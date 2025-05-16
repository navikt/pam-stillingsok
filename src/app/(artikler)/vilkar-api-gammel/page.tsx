import VilkarApiGammel from "@/app/(artikler)/vilkar-api-gammel/VilkarApiGammel";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Gamle vilkår for bruk av API for stillingsannonser",
};

export default function Page() {
    return <VilkarApiGammel />;
}
