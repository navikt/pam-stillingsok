import { getMetadataTitle } from "@/app/layout";
import TilgangsstyringIStoreVirksomheter from "@/app/(artikler)/tilgangsstyring-i-store-virksomheter/TilgangsstyringIStoreVirksomheter";

export const metadata = {
    title: getMetadataTitle("Tilgangsstyring i store virksomheter"),
};

export default function Page() {
    return <TilgangsstyringIStoreVirksomheter />;
}
