import { Metadata } from "next";
import UngMainPage from "@/features/ung/ui/UngMainPage";

export const metadata: Metadata = {
    title: "Er du ung og vil jobbe?",
    description:
        "Vi lager en egen side for deg som er ung og vil ut i jobb. Her får du tips og hjelp til å finne mulighetene som passer for deg",
};

export default function Page() {
    return <UngMainPage />;
}
