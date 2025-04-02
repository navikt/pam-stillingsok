import { getMetadataTitle } from "@/app/metadata";
import NyttSok from "@/app/(artikler)/slik-bruker-du-det-nye-soket/NyttSok";

export const metadata = {
    title: getMetadataTitle("Slik bruker du det nye søket"),
};

export default function Page() {
    return <NyttSok />;
}
