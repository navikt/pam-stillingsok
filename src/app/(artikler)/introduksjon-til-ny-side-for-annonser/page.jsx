import IntroduksjonTilNySideForAnnonser from "@/app/(artikler)/introduksjon-til-ny-side-for-annonser/IntroduksjonTilNySideForAnnonser";
import { getMetadataTitle } from "@/app/layout";

export const metadata = {
    title: getMetadataTitle("Introduksjon til ny side for annonser"),
};

export default function Page() {
    return <IntroduksjonTilNySideForAnnonser />;
}
