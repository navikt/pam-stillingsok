import Home from "@/app/(forside)/_components/Home";

export const metadata = {
    title: {
        absolute: "Arbeidsplassen.no - Alle ledige jobber, samlet på én plass",
    },
    description:
        "På Arbeidsplassen.no kan du søke etter ledige jobber i hele Norge. Er du arbeidsgiver kan du enkelt og kostnadsfritt lyse ut stillinger.",
    verification: {
        google: "I1DCqGuh-OEl_WXTcLI7NaNdS4-MjGo9nS_g2OQoajo",
    },
};

export default function Page() {
    return <Home />;
}
