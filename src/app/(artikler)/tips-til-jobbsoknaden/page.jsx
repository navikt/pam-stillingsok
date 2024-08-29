import TipsTilJobbsoknaden from "@/app/(artikler)/tips-til-jobbsoknaden/TipsTilJobbsoknaden";
import { getMetadataTitle } from "@/app/layout";

export const metadata = {
    title: getMetadataTitle("Tips til jobbsøknaden"),
};

export default function Page() {
    return <TipsTilJobbsoknaden />;
}
