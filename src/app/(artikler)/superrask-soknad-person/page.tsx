import { getMetadataTitle } from "@/app/metadata";
import SuperraskSoknadPerson from "@/app/(artikler)/superrask-soknad-person/SuperraskSoknadPerson";

export const metadata = {
    title: getMetadataTitle("Superrask søknad"),
};

export default function Page() {
    return <SuperraskSoknadPerson />;
}
