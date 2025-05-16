import Utlogget from "@/app/(artikler)/utlogget/Utlogget";

export const metadata = {
    title: "Utlogget",
};

export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
    const timeout: boolean = searchParams?.timeout === "true";
    return <Utlogget timeout={timeout} />;
}
