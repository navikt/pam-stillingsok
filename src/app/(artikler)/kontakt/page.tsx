import { getMetadataTitle } from "@/constants/layout";
import Kontakt from "@/app/(artikler)/kontakt/Kontakt";

export const metadata = {
    title: getMetadataTitle("Kontakt oss"),
};

export default function Page() {
    return <Kontakt />;
}
