import { getMetadataTitle } from "@/app/metadata";
import TilgangSomArbeidsgiver from "@/app/(artikler)/tilgang-som-arbeidsgiver/TilgangSomArbeidsgiver";

export const metadata = {
    title: getMetadataTitle("Hvordan gi eller få tilgang som arbeidsgiver"),
};

export default function Page() {
    return <TilgangSomArbeidsgiver />;
}
