import VilkarApi from "@/app/(artikler)/vilkar-api/VilkarApi";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Vilkår for bruk av API for stillingsannonser",
};

export default function Page() {
    return <VilkarApi />;
}
