import { getMetadataTitle } from "@/app/layout";
import PersonvernIkkeUnderOppfolging from "@/app/(artikler)/personvern-ikke-under-oppfolging/PersonvernIkkeUnderOppfolging";

export const metadata = {
    title: getMetadataTitle("Personvernerklæring for deg som ikke er under arbeidsrettet oppfølging fra NAV"),
};

export default function Page() {
    return <PersonvernIkkeUnderOppfolging />;
}
