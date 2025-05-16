import NyttigeArtiklerForJobbsokere from "@/app/(artikler)/nyttige-artikler-for-jobbsokere/NyttigeArtiklerForJobbsokere";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Nyttige artikler for jobbsøkere",
};

export default function Page() {
    return <NyttigeArtiklerForJobbsokere />;
}
