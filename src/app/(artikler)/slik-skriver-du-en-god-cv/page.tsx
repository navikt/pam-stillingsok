import { getMetadataTitle } from "@/app/metadata";
import SlikSkriverDuEnGodCv from "@/app/(artikler)/slik-skriver-du-en-god-cv/SlikSkriverDuEnGodCv";

export const metadata = {
    title: getMetadataTitle("Slik skriver du en god CV"),
};

export default function Page() {
    return <SlikSkriverDuEnGodCv />;
}
