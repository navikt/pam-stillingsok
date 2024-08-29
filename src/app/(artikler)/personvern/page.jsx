import { getMetadataTitle } from "@/app/layout";
import Personvern from "@/app/(artikler)/personvern/Personvern";

export const metadata = {
    title: getMetadataTitle("Personvernerklæring for arbeidsplassen.no"),
};

export default function Page() {
    return <Personvern />;
}
