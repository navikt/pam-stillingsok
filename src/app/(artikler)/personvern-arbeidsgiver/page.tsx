import PersonvernArbeidsgiver from "@/app/(artikler)/personvern-arbeidsgiver/PersonvernArbeidsgiver";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Personvernerklæring for deg som representerer en arbeidsgiver",
};

export default function Page() {
    return <PersonvernArbeidsgiver />;
}
