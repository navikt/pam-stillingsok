import TilgangSomArbeidsgiver from "@/app/(artikler)/tilgang-som-arbeidsgiver/TilgangSomArbeidsgiver";
import { getMetadataTitle } from "@/app/layout";

export const metadata = {
    title: getMetadataTitle("Hvordan gi eller få tilgang som arbeidsgiver"),
};

export default function Page() {
    return <TilgangSomArbeidsgiver />;
}
