import { getMetadataTitle } from "@/app/layout";
import NyttigeArtiklerForBedrifter from "@/app/(artikler)/nyttige-artikler-for-bedrifter/NyttigeArtiklerForBedrifter";

export const metadata = {
    title: getMetadataTitle("Nyttige artikler for bedrifter"),
};

export default function Page() {
    return <NyttigeArtiklerForBedrifter />;
}
