import { ReactElement } from "react";
import Sommerjobb from "@/app/sommerjobb/_components/Sommerjobb";

export default async function Page(): Promise<ReactElement> {
    const result = [
        {
            uuid: "1",
            title: "Turisthyttemedarbeider sommer 2025",
            description:
                "Medarbeider og sommerhjelp søkes til sesongen 2025. Det største behovet for ansatte er fra 8. Juli og så langt utover august som mulig. (Vi stenger 9. Oktober) Tidligere erfaring fra servicejobb eller reiselivsbransjen er en stor fordel.",
            location: "Lom",
            employerName: "Spiterstulen Turisthytte",
            applicationDueDate: "Søk senest søndag 2. mars",
        },
        {
            uuid: "2",
            title: "Turisthyttemedarbeider 2",
            description:
                "Medarbeider og sommerhjelp søkes til sesongen 2025. Det største behovet for ansatte er fra 8. Juli og så langt utover august som mulig. (Vi stenger 9. Oktober) Tidligere erfaring fra servicejobb eller reiselivsbransjen er en stor fordel.",
            location: "Lom",
            employerName: "Spiterstulen Turisthytte",
            applicationDueDate: "Søk senest søndag 2. mars",
        },
    ];

    return <Sommerjobb result={result} />;
}
