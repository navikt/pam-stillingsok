import { getMetadataTitle } from "@/app/layout";
import OmArbeidsplassen from "@/app/(artikler)/om-arbeidsplassen/OmArbeidsplassen";

export const metadata = {
    title: getMetadataTitle("Om arbeidsplassen.no"),
};

export default function Page() {
    return <OmArbeidsplassen />;
}
