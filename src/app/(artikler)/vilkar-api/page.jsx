import { getMetadataTitle } from "@/app/layout";
import VilkarApi from "@/app/(artikler)/vilkar-api/VilkarApi";

export const metadata = {
    title: getMetadataTitle("Vilkår for bruk av API for stillingsannonser"),
};

export default function Page() {
    return <VilkarApi />;
}
