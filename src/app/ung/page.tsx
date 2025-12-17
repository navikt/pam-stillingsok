import { Metadata } from "next";
import UngMainPage from "@/features/ung/ui/UngMainPage";

export const metadata: Metadata = {
    title: "Er du ung og vil jobbe?",
    description:
        "Vi jobber med å bygge denne siden for unge jobbsøkere! I 2026 kommer vi med mer nytt innhold som hjelper deg å finne og søke jobb. Følg med!",
};

export default function Page() {
    return <UngMainPage />;
}
