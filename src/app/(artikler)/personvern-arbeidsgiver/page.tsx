import { getMetadataTitle } from "@/app/metadata";
import PersonvernArbeidsgiver from "@/app/(artikler)/personvern-arbeidsgiver/PersonvernArbeidsgiver";

export const metadata = {
    title: getMetadataTitle("Personvernerklæring for deg som representerer en arbeidsgiver"),
};

export default function Page() {
    return <PersonvernArbeidsgiver />;
}
