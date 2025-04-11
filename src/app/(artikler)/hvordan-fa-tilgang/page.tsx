import { getMetadataTitle } from "@/app/metadata";
import HvordanFaTilgang from "@/app/(artikler)/hvordan-fa-tilgang/HvordanFaTilgang";

export const metadata = {
    title: getMetadataTitle("Slik kan du skaffe deg tilgang"),
};

export default function Page() {
    return <HvordanFaTilgang />;
}
