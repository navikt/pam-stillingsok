import Kontakt from "@/app/(artikler)/kontakt/_components/Kontakt";
import { getMetadataTitle } from "@/constants/layout";

export const metadata = {
    title: getMetadataTitle("Kontakt oss"),
};

export default function Page() {
    return <Kontakt />;
}
