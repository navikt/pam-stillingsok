import { ElasticDocHit, LegacyAd } from "@/app/(nonce)/stillinger/_common/lib/ad-model";
import { FAKE_ID, FAKE_INDEX } from "@/app/(nonce)/stillinger/_common/lib/ad-model/__tests__/__fixtures__/ids";

export const baseHit: ElasticDocHit<LegacyAd> = {
    _index: FAKE_INDEX,
    _id: FAKE_ID,
    _version: 3,
    _seq_no: 878767,
    _primary_term: 1,
    found: true,
    _source: {
        expires: "2025-10-23T00:00:00+02:00",
        businessName: "Beitostølen Restaurantdrift As",
        published: "2025-10-02T11:34:48+02:00",
        medium: "Stillingsregistrering",
        source: "Stillingsregistrering",
        title: "Resepsjonist søkes til Fjellstølen",
        reference: FAKE_ID,
        locationList: [
            {
                country: "NORGE",
                address: "Fjellgata 1",
                city: "Fjellstølen",
                postalCode: "0161",
                county: "Fjellstølen",
                municipal: "Fjellstølen",
            },
        ],
        contactList: [{ phone: null, name: "Ola Nordmann", title: null, email: "ola.nordmann@eksempel.no" }],
        employer: { name: "Fjellstølen AS", orgnr: "912345678" },
        updated: "2025-10-02T11:53:23.680576+02:00",
        properties: {
            extent: "Deltid",
            workhours: ["Dagtid", "Kveld"],
            employerhomepage: "www.dalen-fjell.no/",
            workday: ["Ukedager", "Lørdag", "Søndag"],
            applicationdue: "2025-10-23",
            jobtitle: "Resepsjonist hotell",
            positioncount: "1",
            engagementtype: "Annet",
            starttime: "Etter avtale",
            employerdescription:
                "<p><strong>Moderne leiligheter</strong> – for familie og venner. Kjøkken og gratis Wi-Fi.</p>",
            remote: "Hjemmekontor ikke mulig",
            jobarrangement: "Vakt",
            adtext: '<section id="arb-aapningstekst"><p>Ekstrahjelp i resepsjon. Søk på maria.nordmann&#64;eksempel.no</p></section>',
            hasInterestform: "false",
            workLanguage: ["Norsk", "Engelsk", "Skandinavisk"],
            applicationemail: "maria.nordmann@eksempel.no",
            adtextFormat: "strukturert",
            jobpercentage: "35",
            employer: "Fjellstølen AS",
            jobpercentagerange: "20-50",
            sector: "Privat",
        },
        status: "ACTIVE",
    },
};

// Enkel builder for overrides
export function makeHit(overrides: Partial<ElasticDocHit<LegacyAd>> = {}): ElasticDocHit<LegacyAd> {
    return structuredClone({ ...baseHit, ...overrides });
}
