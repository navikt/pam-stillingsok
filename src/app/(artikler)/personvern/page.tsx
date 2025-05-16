import Personvern from "@/app/(artikler)/personvern/Personvern";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Personvernerklæring for arbeidsplassen.no",
};

export default function Page() {
    return <Personvern />;
}
