import Home from "@/app/(forside)/_components/Home";

export const metadata = {
    title: {
        absolute: "Arbeidsplassen.no - Alle ledige jobber, samlet på én plass",
    },
    description:
        "På Arbeidsplassen.no kan du søke etter ledige jobber i hele Norge. Er du arbeidsgiver kan du enkelt og kostnadsfritt lyse ut stillinger.",
    verification: {
        google: "7MTNwzfLka2R0KYqPUdxNevMpV30VnRPi77DeyErt58",
    },
};

export default function Page() {
    return <Home />;
}
