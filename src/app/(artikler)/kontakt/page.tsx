import { getMetadataTitle } from "@/app/_common/metadata";
import Kontakt from "@/app/(artikler)/kontakt/_components/Kontakt";

export const metadata = {
    title: getMetadataTitle("Kontakt oss"),
};

export default function Page() {
    return <Kontakt />;
}
