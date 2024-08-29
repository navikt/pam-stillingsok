import SuperraskSoknadPerson from "@/app/(artikler)/superrask-soknad-person/SuperraskSoknadPerson";
import { getMetadataTitle } from "@/app/layout";

export const metadata = {
    title: getMetadataTitle("Superrask søknad"),
};

export default function Page() {
    return <SuperraskSoknadPerson />;
}
