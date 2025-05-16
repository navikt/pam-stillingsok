import Utlogget from "@/app/(artikler)/utlogget/Utlogget";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Utlogget",
};

export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
    const timeout: boolean = searchParams?.timeout === "true";
    return <Utlogget timeout={timeout} />;
}
