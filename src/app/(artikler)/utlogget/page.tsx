import { getMetadataTitle } from "@/app/metadata";
import Utlogget from "@/app/(artikler)/utlogget/Utlogget";

export const metadata = {
    title: getMetadataTitle("Utlogget"),
};

export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
    const timeout: boolean = searchParams?.timeout === "true";
    return <Utlogget timeout={timeout} />;
}
