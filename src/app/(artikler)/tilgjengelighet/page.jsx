import { getMetadataTitle } from "@/app/layout";
import Tilgjengelighet from "@/app/(artikler)/tilgjengelighet/Tilgjengelighet";

export const metadata = {
    title: getMetadataTitle("Tilgjengelighet"),
};

export default function Page() {
    return <Tilgjengelighet />;
}
