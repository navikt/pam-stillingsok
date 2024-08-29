import Vilkar from "@/app/(artikler)/vilkar/Vilkar";
import { getMetadataTitle } from "@/app/layout";

export const metadata = {
    title: getMetadataTitle("Vilkår for å publisere stillinger"),
};

export default function Page() {
    return <Vilkar />;
}
