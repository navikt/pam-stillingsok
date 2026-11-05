import type { Metadata } from "next";
import { getExperimentAssignments } from "@/app/_experiments/next/experiments";
import { ExperimentsProvider } from "@/app/_experiments/react/Experiments";
import Home from "@/app/(forside)/_components/Home";

export const metadata: Metadata = {
    title: {
        absolute: "Arbeidsplassen.no - Alle ledige jobber, samlet på én plass",
    },
    description:
        "På Arbeidsplassen.no kan du søke etter ledige jobber i hele Norge. Er du arbeidsgiver kan du enkelt og kostnadsfritt lyse ut stillinger.",
    verification: {
        google: "I1DCqGuh-OEl_WXTcLI7NaNdS4-MjGo9nS_g2OQoajo",
    },
};

export default async function Page() {
    const assignments = await getExperimentAssignments();
    return (
        <ExperimentsProvider assignments={assignments}>
            <Home />
        </ExperimentsProvider>
    );
}
