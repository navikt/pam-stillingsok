import { getMetadataTitle } from "@/app/metadata";
import SommerjobbJobbsoker from "@/app/(artikler)/jobbsoker-sommerjobb/SommerjobbJobbsoker";

export const metadata = {
    title: getMetadataTitle("Sommerjobben venter på deg!"),
};

export default function Page() {
    return <SommerjobbJobbsoker />;
}
