import SuperraskSoknadPerson from "@/app/(artikler)/superrask-soknad-person/SuperraskSoknadPerson";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Superrask søknad",
};

export default function Page() {
    return <SuperraskSoknadPerson />;
}
