import Tilgjengelighet from "@/app/(artikler)/tilgjengelighet/Tilgjengelighet";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Tilgjengelighet",
};

export default function Page() {
    return <Tilgjengelighet />;
}
