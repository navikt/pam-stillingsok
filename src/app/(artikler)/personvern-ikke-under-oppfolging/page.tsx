import PersonvernIkkeUnderOppfolging from "@/app/(artikler)/personvern-ikke-under-oppfolging/PersonvernIkkeUnderOppfolging";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Personvernerklæring for deg som ikke er under arbeidsrettet oppfølging fra Nav",
};

export default function Page() {
    return <PersonvernIkkeUnderOppfolging />;
}
