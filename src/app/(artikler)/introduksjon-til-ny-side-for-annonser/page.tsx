import IntroduksjonTilNySideForAnnonser from "@/app/(artikler)/introduksjon-til-ny-side-for-annonser/IntroduksjonTilNySideForAnnonser";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Introduksjon til ny side for annonser",
};

export default function Page() {
    return <IntroduksjonTilNySideForAnnonser />;
}
