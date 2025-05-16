import Arbeidsgivertjenester from "@/app/(artikler)/arbeidsgivertjenester/Arbeidsgivertjenester";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Hvem kan bruke arbeidsgivertjenestene?",
};

export default function Page() {
    return <Arbeidsgivertjenester />;
}
