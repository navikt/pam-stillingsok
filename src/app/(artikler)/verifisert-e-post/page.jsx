import { getMetadataTitle } from "@/app/layout";
import VerifisertEpost from "@/app/(artikler)/verifisert-e-post/VerifisertEpost";

export const metadata = {
    title: getMetadataTitle("E-postadressen din er bekreftet"),
};

export default function Page() {
    return <VerifisertEpost />;
}