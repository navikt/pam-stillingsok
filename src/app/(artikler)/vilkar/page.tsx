import { getMetadataTitle } from "@/app/metadata";
import Vilkar from "@/app/(artikler)/vilkar/Vilkar";

export const metadata = {
    title: getMetadataTitle("Vilkår for å publisere stillinger"),
};

export default function Page() {
    return <Vilkar />;
}
