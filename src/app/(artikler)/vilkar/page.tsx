import Vilkar from "@/app/(artikler)/vilkar/Vilkar";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Vilkår for å publisere stillinger",
};

export default function Page() {
    return <Vilkar />;
}
