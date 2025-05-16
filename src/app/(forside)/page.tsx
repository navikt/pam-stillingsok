import Home from "@/app/(forside)/_components/Home";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Arbeidsplassen.no - Alle ledige jobber, samlet på én plass",
    description:
        "På Arbeidsplassen.no kan du søke etter ledige jobber i hele Norge. Er du arbeidsgiver kan du enkelt og kostnadsfritt lyse ut stillinger.",
    verification: {
        google: "7MTNwzfLka2R0KYqPUdxNevMpV30VnRPi77DeyErt58",
    },
};

export default function Page() {
    return <Home />;
}
