import { getMetadataTitle } from "@/app/metadata";
import PersonvernIkkeUnderOppfolging from "@/app/(artikler)/personvern-ikke-under-oppfolging/PersonvernIkkeUnderOppfolging";

export const metadata = {
    title: getMetadataTitle("Personvernerklæring for deg som ikke er under arbeidsrettet oppfølging fra Nav"),
};

export default function Page() {
    return <PersonvernIkkeUnderOppfolging />;
}
