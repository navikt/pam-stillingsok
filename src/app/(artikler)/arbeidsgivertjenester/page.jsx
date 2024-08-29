import { getMetadataTitle } from "@/app/layout";
import Arbeidsgivertjenester from "@/app/(artikler)/arbeidsgivertjenester/Arbeidsgivertjenester";

export const metadata = {
    title: getMetadataTitle("Hvem kan bruke arbeidsgivertjenestene?"),
};

export default function Page() {
    return <Arbeidsgivertjenester />;
}
