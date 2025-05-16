import TilgangSomArbeidsgiver from "@/app/(artikler)/tilgang-som-arbeidsgiver/TilgangSomArbeidsgiver";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Hvordan gi eller få tilgang som arbeidsgiver",
};

export default function Page() {
    return <TilgangSomArbeidsgiver />;
}
