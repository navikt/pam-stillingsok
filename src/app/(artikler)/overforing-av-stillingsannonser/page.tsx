import OverforingAvStillingsannonser from "@/app/(artikler)/overforing-av-stillingsannonser/OverforingAvStillingsannonser";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Overføring av stillingsannonser til arbeidsplassen.no",
};

export default function Page() {
    return <OverforingAvStillingsannonser />;
}
