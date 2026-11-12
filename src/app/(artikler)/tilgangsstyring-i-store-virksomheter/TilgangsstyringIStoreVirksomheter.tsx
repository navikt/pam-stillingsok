import { InformationSquareIcon } from "@navikt/aksel-icons";
import { BodyLong, Heading, InfoCard } from "@navikt/ds-react";
import { InfoCardContent, InfoCardHeader, InfoCardTitle } from "@navikt/ds-react/InfoCard";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

type Props = {
    readonly meta: PageInfo;
};

export default function TilgangsstyringIStoreVirksomheter({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <Heading spacing size="xlarge" level="1">
                {meta.title}
            </Heading>
            <InfoCard data-color="info" className="mb-12">
                <InfoCardHeader icon={<InformationSquareIcon aria-hidden />}>
                    <InfoCardTitle>Tilgang til rekrutteringstjenesten</InfoCardTitle>
                </InfoCardHeader>
                <InfoCardContent>
                    <BodyLong>
                        For at du eller en kollega skal kunne bruke Navs rekrutteringstjeneste på vegne av virksomheten,
                        må dere ha enkelttilgangen «Stillingsannonser på arbeidsplassen.no» eller tilgangspakken
                        «Ansettelsesforhold». Tilgangene kan gis for hovedenhet (inkludert alle underenheter) eller for
                        én enkelt underenhet. Arbeidsgiver kan delegere tilgang til deg via Altinn, dersom du ikke
                        allerede har den.
                    </BodyLong>
                </InfoCardContent>
            </InfoCard>
            <Heading spacing size="large" level="2">
                Hvordan fungerer tilgangspakken «Tilgangsstyring»?
            </Heading>
            <BodyLong spacing>
                En praktisk måte å organisere tilgangsstyring på, er å tildele en eller flere medarbeidere
                tilgangspakken «Tilgangsstyring». Denne tilgangspakken kan tildele rettigheter i organisasjonen.
            </BodyLong>
            <BodyLong spacing>
                Merk at en person som skal ha tilgangspakken «Tilgangsstyring», selv må ha de
                tilgangspakkene/enkelttjenestene hen skal administrere. En tilgangsstyrer må derfor ha enkelttilgangen
                «Stillingsannonser på arbeidsplassen.no» og/eller tilgangspakken «Ansettelsesforhold» for å kunne gi
                andre den samme retten som gir tilgang som arbeidsgiver til arbeidsplassen.no.
            </BodyLong>

            <Heading spacing size="large" level="2">
                Hvordan fungerer rollen «Hovedadministrator»?
            </Heading>
            <BodyLong spacing>
                Hvis virksomheten ønsker at én nøkkelperson skal administrere alle Altinn-rettigheter på vegne av
                virksomheten, er løsningen tilgangspakken «Hovedadministrator». Styrets leder, styrende reder eller
                innehaver kan etablere denne tilgangspakken.
            </BodyLong>
            <BodyLong spacing>
                Hovedadministrator kan delegere alle tilgangspakker og enkelttjenester for en virksomhet, også
                tilgangspakker og enkelttjenester som hovedadministratoren ikke har selv. Hovedadministrator kan derfor
                både gi og trekke enkelttjenesten «Stillingsannonser på arbeidsplassen.no» eller tilgangspakken
                «Ansettelsesforhold».
            </BodyLong>
            <BodyLong spacing>
                Hovedadministrator kan også gi en eller flere medarbeidere tilgangspakken «Tilgangsstyring».
                Hovedadministrator tar da en overordnet rolle, mens tilgangsstyrere administrerer tilgangspakker og
                enkelttjenester, for eksempel enkelttjenesten «Stillingsannonser på arbeidsplassen.no».
            </BodyLong>
            <BodyLong spacing>Les mer om tilgangspakker og enkelttjenester på altinn.no.</BodyLong>

            <Heading spacing size="large" level="2">
                Har jeg allerede riktig rolle for å gi tilgang til arbeidsplassen.no?
            </Heading>
            <BodyLong spacing>Logg inn i Altinn – da vil du se hvilke tilganger du har.</BodyLong>
            <BodyLong spacing>
                Hvis du er registrert i Enhetsregisteret som daglig leder, styreleder, styrende reder eller innehaver,
                vil du automatisk ha alle tilganger som du kan gi videre til andre.
            </BodyLong>
            <BodyLong spacing>
                Har du tilgangspakken «Hovedadministrator», kan du gi andre medarbeidere de tilgangene de trenger.
            </BodyLong>
            <BodyLong spacing>
                Har du tilgangspakken «Tilgangsstyrer», kan du gi andre medarbeidere de tilgangene de trenger, forutsatt
                at du selv har rettighetene du skal tildele (enkelttjenesten «Stillingsannonser på arbeidsplassen.no»
                eller tilgangspakken «Ansettelsesforhold»).
            </BodyLong>
            <BodyLong spacing>
                Hvis du ikke har de nødvendige rollene for å kunne gi tilgang videre, kan daglig leder eller
                hovedadministrator i virksomheten gi deg nødvendige tilganger.
            </BodyLong>

            <Heading spacing size="large" level="2">
                Bør jeg delegere tilgang gjennom tilgangspakke eller enkelttilgang?
            </Heading>
            <BodyLong spacing>
                Enkelttilgangen «Stillingsannonser på arbeidsplassen.no» gir tilgang til å bruke stillingsregistrering
                og superrask søknad på arbeidsplassen.no. Denne gir ikke tilgang til CV-er. Da kan du som arbeidsgiver
                være trygg på at en medarbeider ikke får tilgang til andre tjenester.
            </BodyLong>
            <BodyLong spacing>
                Hvis du tildeler tilgangspakken «Ansettelsesforhold», gir den bredere tilgang til flere tjenester enn
                bare arbeidsplassen.no.
            </BodyLong>
            <Heading spacing size="large" level="2">
                Jeg er usikker på hva «Stillingsannonser på arbeidsplassen.no» gir tilgang til
            </Heading>
            <BodyLong spacing>
                Enkelttjenesten «Stillingsannonser på arbeidsplassen.no» gir tilgang til å bruke stillingsregistrering
                og superrask søknad på arbeidsplassen.no. Denne gir ikke tilgang til CV-er.
            </BodyLong>
            <BodyLong spacing>
                Hvis du tildeler denne enkelttilgangen, kan du være sikker på at du ikke gir tilgang til andre tjenester
                enn Navs rekrutteringstjenester.
            </BodyLong>
        </ArticleWrapper>
    );
}
