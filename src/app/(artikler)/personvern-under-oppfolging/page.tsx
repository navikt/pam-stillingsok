import { getMetadataTitle } from "@/app/metadata";
import PersonvernUnderOppfolging from "@/app/(artikler)/personvern-under-oppfolging/PersonvernUnderOppfolging";

export const metadata = {
    title: getMetadataTitle("Personvernerklæring for deg som er under arbeidsrettet oppfølging fra Nav"),
};

export default function Page() {
    return <PersonvernUnderOppfolging />;
}
