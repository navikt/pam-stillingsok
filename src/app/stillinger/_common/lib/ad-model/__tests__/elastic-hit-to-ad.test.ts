import { describe, it, expect } from "vitest";
import { ElasticDocHit, elasticHitToAdDTOResult } from "../index";
import type { LegacyAd } from "../schemas/legacy.schemas";
import { unwrapOk } from "@/app/stillinger/_common/lib/ad-model/core/result-utils";

const hit: ElasticDocHit<LegacyAd> = {
    _index: "ad-202509251439",
    _id: "8f4ea202-b79b-4b89-bca7-1ac705b92c62",
    _version: 3,
    _seq_no: 62956,
    _primary_term: 1,
    found: true,
    _source: {
        expires: "2025-10-23T00:00:00+02:00",
        businessName: "Beitostølen Restaurantdrift As",
        published: "2025-10-02T11:34:48+02:00",
        medium: "Stillingsregistrering",
        source: "Stillingsregistrering",
        title: "Resepsjonist søkes til Riddergaarden Mountain Lodge",
        reference: "8f4ea202-b79b-4b89-bca7-1ac705b92c62",
        locationList: [
            {
                country: "NORGE",
                address: "Skjenhauglie 41",
                city: "BEITOSTØLEN",
                postalCode: "2953",
                county: "INNLANDET",
                municipal: "ØYSTRE SLIDRE",
            },
        ],
        contactList: [
            {
                phone: "",
                name: "Kathrine Lien",
                title: null,
                email: "kathrine.lien@riddergaarden.no",
            },
        ],
        employer: {
            name: "BEITOSTØLEN RESTAURANTDRIFT AS",
            orgnr: "931104047",
        },
        updated: "2025-10-02T11:53:23.680576+02:00",
        properties: {
            extent: "Deltid",
            workhours: ["Dagtid", "Kveld"],
            employerhomepage: "www.riddergaarden.no/",
            workday: ["Ukedager", "Lørdag", "Søndag"],
            applicationdue: "2025-10-23",
            jobtitle: "Resepsjonist hotell",
            positioncount: "1",
            engagementtype: "Annet",
            starttime: "Etter avtale",
            employerdescription:
                "<p><strong>Fleksible og moderne leiligheter -- tilpasset dine behov</strong></p>\n<p>Hos Riddergaarden finner du leiligheter som passer for alle, enten du er på familietur eller reiser med venner. Våre koselige boenheter rommer fra 2 til 6 personer, og størrelsene varierer fra 35 m² til 90 m². De minste leilighetene har en praktisk alkove med køyeseng, mens de største har flere soverom, stue og badstue -- perfekt for lange, avslappende kvelder etter en aktiv dag.</p>\n<p>Alle leilighetene er utstyrt med moderne kjøkken, der oppvaskmaskin er standard, og hyggelige spiseplasser og stuer med loungeområder. Gratis internett er tilgjengelig, og vi tilbyr innendørs garasjeplass mot avgift. I garasjen kan du også leie skiskap for oppbevaring av utstyret ditt. Heis er tilgjengelig i alle bygg, så det er enkelt å komme seg rundt.</p>\n",
            remote: "Hjemmekontor ikke mulig",
            jobarrangement: "Vakt",
            adtext: '<section id="arb-aapningstekst">\n<p>Vi søker nye kollegaer på fjellet! ⛰️\nRiddergaarden Mountain Lodge styrker teamet – og kanskje er det nettopp deg vi ser etter?</p>\n</section>\n<section id="arb-serEtter">\n<h2>Hva vi ser etter</h2>\n<p><strong>Velkommen til Riddergaarden Mountain Lodge -- Din Oase av Komfort og Luksus</strong></p>\n<p>På Riddergaarden Mountain Lodge får du alt du forventer -- og mer til. Fra velutstyrte leiligheter til førsteklasses service og fasiliteter, tilbyr vi en opplevelse som er skreddersydd for å gi deg både ro og eventyr.</p>\n<p><strong>Det beste av Beitostølen!</strong></p>\n<p>Nyt naturen, komforten og luksusen som omgir Riddergaarden Mountain Lodge. Her er stedet for å skape minner som varer!</p>\n</section>\n<section id="arb-arbeidsoppgaver">\n<h2>Arbeidsoppgaver</h2>\n<p>Vi har ledig stilling i resepsjonen:</p>\n<p>Ekstrahjelp -- ta én til to faste helger i måneden, ferier og bidra når det trengs</p>\n<p>Vi ser etter deg som:</p>\n<ul><li>\n<p>Er serviceinnstilt, selvstendig og pålitelig</p>\n</li><li>\n<p>Trives med å skape gode gjesteopplevelser</p>\n</li><li>\n<p>Er fleksibel og samarbeider godt i team</p>\n</li></ul>\n<p>Interessert? Send en søknad &#43; CV til kathrine.lien&#64;riddergaarden.no</p>\n<p>Vi vurderer søknader fortløpende -- så ikke vent for lenge!</p>\n</section>\n<section id="arb-tilbyr">\n<h2>Vi tilbyr</h2>\n<p>Bli en del av et engasjert team midt i fjellheimen -- på Beitostølens nyeste lodge med spa, restaurant og utsikt du ikke blir lei av</p>\n<p>Vi tilbyr varierte oppgaver, gode kollegaer og ikke minst muligheten til å være en del av nordens største hotellkjede.</p>\n</section>\n',
            hasInterestform: "false",
            workLanguage: ["Norsk", "Engelsk", "Skandinavisk"],
            applicationemail: "kathrine.lien@riddergaarden.no",
            adtextFormat: "strukturert",
            jobpercentage: "35",
            employer: "Beitostølen Restaurantdrift As",
            jobpercentagerange: "20-50",
            sector: "Privat",
        },
        status: "ACTIVE",
    },
};

describe("elasticHitToAdDTO", () => {
    it("konverterer ES hit til AdDTO og normaliserer felter", () => {
        const res = elasticHitToAdDTOResult(hit);
        const adDTO = unwrapOk(res);
        expect(adDTO).toBeDefined();

        // id fra _id
        expect(adDTO.id).toBe("8f4ea202-b79b-4b89-bca7-1ac705b92c62");

        // enkle strenger
        expect(adDTO.title).toBe("Resepsjonist søkes til Riddergaarden Mountain Lodge");
        expect(adDTO.status).toBe("ACTIVE");
        expect(adDTO.source).toBe("Stillingsregistrering");
        expect(adDTO.medium).toBe("Stillingsregistrering");
        expect(adDTO.reference).toBe("8f4ea202-b79b-4b89-bca7-1ac705b92c62");

        expect(adDTO.applicationEmail).toBe("kathrine.lien@riddergaarden.no");

        expect(adDTO.published?.startsWith("2025-10-02T09:34:48")).toBe(true); // 11:34:48+02 → 09:34:48Z
        expect(adDTO.updated?.startsWith("2025-10-02T09:53:23")).toBe(true);
        expect(adDTO.expires?.startsWith("2025-10-22T22:00:00")).toBe(true); // midnatt +02 → 22:00:00Z forrige dag
        expect(adDTO.applicationDue).toBe("2025-10-23");

        expect(adDTO.hasSuperraskSoknad).toBe(false);
        expect(adDTO.positionCount).toBe(1);
        expect(adDTO.remote).toBe("Hjemmekontor ikke mulig");
        expect(adDTO.jobPercentage).toBe("35%");
        expect(adDTO.jobPercentageRange).toBe("20% - 50%");

        // arbeidstid
        expect(adDTO.workdays).toEqual(["Ukedager", "Lørdag", "Søndag"]);
        expect(adDTO.workHours).toEqual(["Dagtid", "Kveld"]);

        expect(adDTO.workLanguages).toEqual(["Norsk", "Engelsk", "Skandinavisk"]);

        // employer + lenker
        expect(adDTO.employer?.name).toBe("Beitostølen Restaurantdrift As");
        expect(adDTO.employer?.orgnr).toBe("931104047");
        expect(adDTO.employer?.homepage).toBe("https://www.riddergaarden.no/");

        expect(adDTO.contactList?.[0].phone).toBe(undefined);
        expect(adDTO.contactList?.[0].name).toBe("Kathrine Lien");
        expect(adDTO.contactList?.[0].title).toEqual(undefined);
        expect(adDTO.contactList?.[0].email).toBe("kathrine.lien@riddergaarden.no");

        // adTextHtml har mailto-lenke og er sanitert
        expect(adDTO.adTextHtml?.includes("mailto:kathrine.lien@riddergaarden.no")).toBe(true);

        // location
        expect(adDTO.locationList?.[0].city).toBe("BEITOSTØLEN");
        expect(adDTO.locationList?.[0].country).toBe("NORGE");

        // felter som ikke finnes i kilden
        expect(adDTO.applicationUrl).toBeUndefined();
        expect(adDTO.adTextFormat).toBe("strukturert");
    });
});
