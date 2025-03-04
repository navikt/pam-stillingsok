import { ReactElement } from "react";
import Sommerjobb from "@/app/sommerjobb/_components/Sommerjobb";

export default async function Page(): Promise<ReactElement> {
    const result = [
        {
            uuid: "1",
            title: "Turisthyttemedarbeider sommer 2025",
            description:
                "Medarbeider og sommerhjelp søkes til sesongen 2025. Det største behovet for ansatte er fra 8. Juli og så langt utover august som mulig. (Vi stenger 9. Oktober) Tidligere erfaring fra servicejobb eller reiselivsbransjen er en stor fordel.",
            employerName: "Spiterstulen Turisthytte",
            location: "Lom",
            applicationDueDate: "Søk senest søndag 2. mars",
        },
        {
            uuid: "2",
            title: "Meningsfull og spennende sommerjobb",
            description:
                "Vil du ha sommerjobb på et verdens beste bosenter? Vi søker engasjerte ferievikarer som ønsker å jobbe i tidsrommet uke 25 -33. Er du student under helsefaglig utdanning, sykepleiere og helsefagarbeidere er det en fordel, men ikke et krav. ",
            employerName: "Bosenter AS",
            location: "Oslo, Bergen, Stavanger, m.fl.",
            applicationDueDate: "Søk senest tirsdag 18. februar",
        },
    ];

    return <Sommerjobb result={result} />;
}
