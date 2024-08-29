import { getMetadataTitle } from "@/app/layout";
import Utlogget from "@/app/(artikler)/utlogget/Utlogget";

export const metadata = {
    title: getMetadataTitle("Utlogget"),
};

export default function Page({ searchParams }) {
    return <Utlogget timeoutSearchParam={searchParams.timeout} />;
}
