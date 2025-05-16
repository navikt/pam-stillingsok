import VerifisertEpost from "@/app/(artikler)/verifisert-e-post/VerifisertEpost";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "E-postadressen din er bekreftet",
};

export default function Page() {
    return <VerifisertEpost />;
}
