import { getMetadataTitle } from "@/app/layout";
import NyttigeArtiklerForJobbsokere from "@/app/(artikler)/nyttige-artikler-for-jobbsokere/NyttigeArtiklerForJobbsokere";

export const metadata = {
    title: getMetadataTitle("Nyttige artikler for jobbsøkere"),
};

export default function Page() {
    return <NyttigeArtiklerForJobbsokere />;
}
