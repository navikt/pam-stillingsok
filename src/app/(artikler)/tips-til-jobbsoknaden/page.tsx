import { getMetadataTitle } from "@/app/metadata";
import TipsTilJobbsoknaden from "@/app/(artikler)/tips-til-jobbsoknaden/TipsTilJobbsoknaden";

export const metadata = {
    title: getMetadataTitle("Tips til jobbsøknaden"),
};

export default function Page() {
    return <TipsTilJobbsoknaden />;
}
