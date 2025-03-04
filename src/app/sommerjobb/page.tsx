import { ReactElement } from "react";
import Sommerjobb from "@/app/sommerjobb/_components/Sommerjobb";
import { fetchCachedPostcodes } from "@/app/(sok)/_utils/fetchPostcodes";

export default async function Page({
    searchParams,
}: {
    searchParams: Record<string, string | string[] | undefined>;
}): Promise<ReactElement> {
    const postcodesResult = await fetchCachedPostcodes();
    const postcodes = postcodesResult.data || [];
    console.log(searchParams);

    const ads = [
        {
            uuid: "1",
            title: "Turisthyttemedarbeider sommer 2025",
            description:
                "Medarbeider og sommerhjelp søkes til sesongen 2025. Det største behovet for ansatte er fra 8. Juli og så langt utover august som mulig. (Vi stenger 9. Oktober) Tidligere erfaring fra servicejobb ell...",
            employerName: "Spiterstulen Turisthytte",
            location: "Lom",
            applicationDue: "03.04.2025",
        },
        {
            uuid: "2",
            title: "Meningsfull og spennende sommerjobb",
            description:
                "Vil du ha sommerjobb på et verdens beste bosenter? Vi søker engasjerte ferievikarer som ønsker å jobbe i tidsrommet uke 25 -33. Er du student under helsefaglig utdanning, sykepleiere og hel...",
            employerName: "Bosenter AS",
            location: "Oslo, Bergen, Stavanger, m.fl.",
            applicationDue: "2025-05-06T00:00:00",
        },
        {
            uuid: "3",
            title: "Hunderfossen Hotel & Resort",
            description:
                "Hunderfossen Hotell & Resort ligger midt i hjertet av alle eventyrlige opplevelser på Hunderfossen og har overnatting som passer for alle reisende. 40 komfortable hotellrom, 30 helårs bekve...",
            employerName: "Hunderfossen Hotel & Resort",
            location: "Fåberg",
            applicationDue: "Snarest",
        },
        {
            uuid: "4",
            title: "Din beste sommerjobb",
            description:
                "Er du mellom 13 – 19 år, bosatt i bydel Nordre Aker og ønsker en meningsfull sommer? Kanskje dette er sommerjobben for deg. Det er viktig at du er tilgjengelig for å jobbe hele uker av gangen. Arbei...",
            employerName: "HIMALAYA TANDORI AS",
            location: "Horten",
            applicationDue: "2025-05-10",
        },
        {
            uuid: "5",
            title: "UngJobb sommerjobb 2025",
            description:
                "Stilling: Servitør / Kjøkkenhjelp / Bartender Oppvask Tid: Sommeren 2025 Sted: Horten.Vestfold. Travel og Trivelig Restaurant. Alderskrav: Minimum 20 år (unntak for elever som går salg og ser...",
            employerName: "Forebyggende enhet, Oslo kommune, Bydel Nordre Aker",
            location: "Oslo",
            applicationDue: "2025-05-09T00:00:00",
        },
        {
            uuid: "6",
            title: "Vil du ha en sommerjobb med mening?",
            description:
                "Er du sykepleier, vernepleier, helsefagarbeider, assistent, student eller bare har lyst til å jobbe med mennesker som trenger omsorg, er du velkommen til å søke jobb hos oss. Vi søker engasjerte og m...",
            employerName: "Spiterstulen Turisthytte",
            location: "Lom",
            applicationDue: "Søk Asap",
        },
        {
            uuid: "7",
            title: "Turisthyttemedarbeider sommer 2025",
            description:
                "Bo- og miljøtjenesten har behov for flinke sommervikarer til alle våre enheter i ukene 25-33. Stillingsprosent og arbeidstid vil variere ved de ulike enhetene. Vi har arbeid både på dag, kveld o...",
            employerName: "Spiterstulen Turisthytte",
            location: "Lom",
            applicationDue: "2025-05-19T00:00:00",
        },
        {
            uuid: "8",
            title: "Meningsfull og spennende sommerjobb",
            description:
                "Vi søker medisinstudenter til sommerjobb i BUP Grenland Sør, BUP Vestmar og BUP Notodden. Vil du være med på laget vårt for å bedre psykisk helse for barn og unge? Liker du variasjon i arbeide...",
            employerName: "Odinsvei bosenter",
            location: "Nesttun",
            applicationDue: "2025-04-30T00:00:00",
        },
    ];

    let data = {
        ads: ads,
        totalAds: 38,
    };

    if (searchParams.jobbeMed === "Utendørs") {
        data = {
            ads: [],
            totalAds: 0,
        };
    }

    return <Sommerjobb data={data} postcodes={postcodes} />;
}
