import { ReactElement } from "react";
import Sommerjobb from "@/app/sommerjobb/_components/Sommerjobb";
import { fetchCachedPostcodes } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { getMetadataTitle } from "@/constants/layout";
import { createQuery, toApiQuery } from "@/app/stillinger/(sok)/_utils/query";
import { fetchCachedSimplifiedElasticSearch } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { SommerjobbAd } from "@/app/sommerjobb/_components/SommerjobbResults";

const SummerJobKeywords = {
    SOMMERJOBB: ["Sommerjobb", "Sommervikar", "Sesongarbeid"],
    BUTIKK: ["Butikk", "Salg", "Detaljhandel"],
    HELSE: ["Helse", "Sykepleier", "Lege"],
    KONTOR: ["Kontor", "Administrasjon", "Sekretær"],
    KULTUR: ["Kultur", "Kunst", "Musikk"],
    KUNDESERVICE: ["Kundeservice", "Support", "Kundebehandling"],
    LAGER_OG_INDUSTRI: ["Lager", "Industri", "Produksjon"],
    RENHOLD: ["Renhold", "Vask", "Rengjøring"],
    RESTAURANT_OG_KAFE: ["Restaurant", "Kafé", "Servering"],
    TRANSPORT: ["Transport", "Sjåfør", "Logistikk"],
    TURISME: ["Turisme", "Reise", "Guide"],
    UTENDØRS: ["Utendørs", "Friluft"],
};

export async function generateMetadata() {
    const pageTitle = getMetadataTitle("Sommerjobben 2025");
    const description = "Kafé i Lofoten, butikk i Tromsø eller utendørs jobb i Oslo? Sikre sommereventyret i dag!";
    return {
        title: pageTitle,
        description: description,
        openGraph: {
            title: pageTitle,
            description: description,
            images: [
                {
                    url: "https://arbeidsplassen.nav.no/images/sommerjobb-open-graph.png",
                    width: 1200,
                    height: 630,
                },
            ],
        },
    };
}

export default async function Page({
    searchParams,
}: {
    searchParams: Record<string, string | string[] | undefined>;
}): Promise<ReactElement> {
    const postcodesResult = await fetchCachedPostcodes();
    const postcodes = postcodesResult.data || [];
    console.log(searchParams);
    const searchKeywords: string[] = SummerJobKeywords.SOMMERJOBB;

    const searchResult = await fetchCachedSimplifiedElasticSearch(
        toApiQuery(createQuery({ q: searchKeywords, v: "5" })),
    );
    /**
     * For testing, men merk at alle søkeord bruker OR operator akkurat nå.
     * searchKeywords = Array.from(new Set([...searchKeywords, ...SummerJobKeywords.UTENDØRS])) // Legger til utendørs
     * searchKeywords = searchKeywords.filter(word => !SummerJobKeywords.TURISME.includes(word)); // Fjerner turisme søkeord
     */

    const ads: SommerjobbAd[] = searchResult?.data?.ads.map((ad) => ({
        uuid: ad.uuid,
        title: ad.title,
        description: ad.description || "",
        employer: {
            name: ad.employer.name || "",
        },
        location: ad.locationList?.[0]?.city || "",
        applicationDue: ad.applicationDue || "",
    })) || [
        {
            uuid: "475ac49a-8d46-46bb-a6c7-fa7b9845580a",
            title: "Turisthyttemedarbeider sommer 2025",
            description:
                "Medarbeider og sommerhjelp søkes til sesongen 2025. Det største behovet for ansatte er fra 8. Juli og så langt utover august som mulig. (Vi stenger 9. Oktober) Tidligere erfaring fra servicejobb ell...",
            employer: { name: "Spiterstulen Turisthytte" },
            location: "Lom",
            applicationDue: "03.04.2025",
        },
        {
            uuid: "3ee2df9c-1c75-40e3-bb49-d8833c7b83d7",
            title: "Meningsfull og spennende sommerjobb",
            description:
                "Vil du ha sommerjobb på et verdens beste bosenter? Vi søker engasjerte ferievikarer som ønsker å jobbe i tidsrommet uke 25 -33. Er du student under helsefaglig utdanning, sykepleiere og hel...",
            employer: { name: "Bosenter AS" },
            location: "Oslo, Bergen, Stavanger, m.fl.",
            applicationDue: "2025-05-06T00:00:00",
        },
        {
            uuid: "02211d51-a7e0-42fb-acb5-8a903d7f06e4",
            title: "Hunderfossen Hotel & Resort",
            description:
                "Hunderfossen Hotell & Resort ligger midt i hjertet av alle eventyrlige opplevelser på Hunderfossen og har overnatting som passer for alle reisende. 40 komfortable hotellrom, 30 helårs bekve...",
            employer: { name: "Hunderfossen Hotel & Resort" },
            location: "Fåberg",
            applicationDue: "Snarest",
        },
        {
            uuid: "3c31ef76-af9c-4528-a2b8-a6d7640c91c6",
            title: "Din beste sommerjobb",
            description:
                "Er du mellom 13 – 19 år, bosatt i bydel Nordre Aker og ønsker en meningsfull sommer? Kanskje dette er sommerjobben for deg. Det er viktig at du er tilgjengelig for å jobbe hele uker av gangen. Arbei...",
            employer: { name: "HIMALAYA TANDORI AS" },
            location: "Horten",
            applicationDue: "2025-05-10",
        },
        {
            uuid: "632ee6f8-8220-4654-9ca6-b9b4a4d3eaf2",
            title: "UngJobb sommerjobb 2025",
            description:
                "Stilling: Servitør / Kjøkkenhjelp / Bartender Oppvask Tid: Sommeren 2025 Sted: Horten.Vestfold. Travel og Trivelig Restaurant. Alderskrav: Minimum 20 år (unntak for elever som går salg og ser...",
            employer: { name: "Forebyggende enhet, Oslo kommune, Bydel Nordre Aker" },
            location: "Oslo",
            applicationDue: "2025-05-09T00:00:00",
        },
        {
            uuid: "22f2c93d-e0e0-41b2-a33a-0a0615daf99b",
            title: "Vil du ha en sommerjobb med mening?",
            description:
                "Er du sykepleier, vernepleier, helsefagarbeider, assistent, student eller bare har lyst til å jobbe med mennesker som trenger omsorg, er du velkommen til å søke jobb hos oss. Vi søker engasjerte og m...",
            employer: { name: "Spiterstulen Turisthytte" },
            location: "Lom",
            applicationDue: "Søk Asap",
        },
        {
            uuid: "7841d809-af34-4d3a-9df7-5a6f986795f9",
            title: "Turisthyttemedarbeider sommer 2025",
            description:
                "Bo- og miljøtjenesten har behov for flinke sommervikarer til alle våre enheter i ukene 25-33. Stillingsprosent og arbeidstid vil variere ved de ulike enhetene. Vi har arbeid både på dag, kveld o...",
            employer: { name: "Spiterstulen Turisthytte" },
            location: "Lom",
            applicationDue: "2025-05-19T00:00:00",
        },
        {
            uuid: "b4e6b3eb-d8b6-41c1-baf8-b55378fdb27a",
            title: "Meningsfull og spennende sommerjobb",
            description:
                "Vi søker medisinstudenter til sommerjobb i BUP Grenland Sør, BUP Vestmar og BUP Notodden. Vil du være med på laget vårt for å bedre psykisk helse for barn og unge? Liker du variasjon i arbeide...",
            employer: { name: "Odinsvei bosenter" },
            location: "Nesttun",
            applicationDue: "2025-04-30T00:00:00",
        },
    ];

    let data = {
        ads: ads,
        totalAds: searchResult?.data?.totalAds || 0,
    };

    if (searchParams.jobb === "Utendørs") {
        data = {
            ads: [],
            totalAds: 0,
        };
    }

    if (searchParams.jobb === "Kundeservice") {
        throw new Error("uff..");
    }

    return <Sommerjobb data={data} postcodes={postcodes} />;
}
