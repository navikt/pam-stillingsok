import SkikkeligBraStillingsannonse from "@/app/(artikler)/skikkelig-bra-stillingsannonse/SkikkeligBraStillingsannonse";
import { getMetadataTitle } from "@/app/layout";

export const metadata = {
    title: getMetadataTitle("Hvordan skriver du en skikkelig bra stillingsannonse?"),
};

export default function Page() {
    return <SkikkeligBraStillingsannonse />;
}
