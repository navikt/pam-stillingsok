import { getMetadataTitle } from "@/app/metadata";
import IntroduksjonTilNySideForAnnonser from "@/app/(artikler)/introduksjon-til-ny-side-for-annonser/IntroduksjonTilNySideForAnnonser";

export const metadata = {
    title: getMetadataTitle("Introduksjon til ny side for annonser"),
};

export default function Page() {
    return <IntroduksjonTilNySideForAnnonser />;
}
