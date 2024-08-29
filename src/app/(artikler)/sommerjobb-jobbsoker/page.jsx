import { getMetadataTitle } from "@/app/layout";
import SommerjobbJobbsoker from "@/app/(artikler)/sommerjobb-jobbsoker/SommerjobbJobbsoker";

export const metadata = {
    title: getMetadataTitle("Sommerjobben venter på deg!"),
};

export default function Page() {
    return <SommerjobbJobbsoker />;
}
