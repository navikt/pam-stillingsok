import PersonvernUnderOppfolging from "@/app/(artikler)/personvern-under-oppfolging/PersonvernUnderOppfolging";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Personvernerklæring for deg som er under arbeidsrettet oppfølging fra Nav",
};

export default function Page() {
    return <PersonvernUnderOppfolging />;
}
