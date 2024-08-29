import { getMetadataTitle } from "@/app/layout";
import VilkarApiGammel from "@/app/(artikler)/vilkar-api-gammel/VilkarApiGammel";

export const metadata = {
    title: getMetadataTitle("Gamle vilkår for bruk av API for stillingsannonser"),
};

export default function Page() {
    return <VilkarApiGammel />;
}
