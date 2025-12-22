import type { Metadata } from "next";
import MinSidePage from "@/app/(nonce)/min-side/_common/components/MinSidePage";

export const metadata: Metadata = {
    title: "Min side",
};

export default async function Page() {
    return <MinSidePage />;
}
