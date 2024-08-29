import { getMetadataTitle } from "@/app/layout";
import Sommerjobb from "@/app/(artikler)/sommerjobb/Sommerjobb";

export const metadata = {
    title: getMetadataTitle("Lys ut sommerjobber"),
};

export default function Page() {
    return <Sommerjobb />;
}
