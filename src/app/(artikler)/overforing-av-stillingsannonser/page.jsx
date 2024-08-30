import { getMetadataTitle } from "@/app/layout";
import OverforingAvStillingsannonser from "@/app/(artikler)/overforing-av-stillingsannonser/OverforingAvStillingsannonser";

export const metadata = {
    title: getMetadataTitle("Overføring av stillingsannonser til arbeidsplassen.no"),
};

export default function Page() {
    return <OverforingAvStillingsannonser />;
}