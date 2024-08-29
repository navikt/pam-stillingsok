import HvordanFaTilgang from "@/app/(artikler)/hvordan-fa-tilgang/HvordanFaTilgang";
import { getMetadataTitle } from "@/app/layout";

export const metadata = {
    title: getMetadataTitle("Slik kan du skaffe deg tilgang"),
};

export default function Page() {
    return <HvordanFaTilgang />;
}
