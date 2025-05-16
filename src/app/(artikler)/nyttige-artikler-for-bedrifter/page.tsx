import NyttigeArtiklerForBedrifter from "@/app/(artikler)/nyttige-artikler-for-bedrifter/NyttigeArtiklerForBedrifter";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Nyttige artikler for bedrifter",
};

export default function Page() {
    return <NyttigeArtiklerForBedrifter />;
}
