import PersonvernUnderOppfolging from "@/app/(artikler)/personvern-under-oppfolging/PersonvernUnderOppfolging";
import { getMetadataTitle } from "@/app/layout";

export const metadata = {
    title: getMetadataTitle("Personvernerklæring for deg som er under arbeidsrettet oppfølging fra NAV"),
};

export default function Page() {
    return <PersonvernUnderOppfolging />;
}
