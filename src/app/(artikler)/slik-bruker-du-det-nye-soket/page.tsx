import NyttSok from "@/app/(artikler)/slik-bruker-du-det-nye-soket/NyttSok";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Slik bruker du det nye søket",
};

export default function Page() {
    return <NyttSok />;
}
