import { BodyLong, BodyShort, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";

export default function RetningslinjerStillingsannonser() {
    return (
        <article className="container-small mt-5 mb-24">
            <AkselLink as={NextLink} href="/vilkar-og-retningslinjer" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                <BodyShort>Til Vilkår og retningslinjer</BodyShort>
            </AkselLink>

            <Heading spacing size="xlarge" level="1">
                Retningslinjer for innhold i annonser i Navs stillingsbase
            </Heading>

            <Heading size="large" level="2" spacing>
                1. Innledning
            </Heading>
            <BodyLong className="mb-12">
                Formålet med disse retningslinjene er å bidra til å kvalitetssikre Navs stillingsbase, slik at Nav best
                mulig kan fylle sin oppgave som møtested for arbeidsgivere og arbeidssøkere. Retningslinjene angir
                generelle krav til innhold i stillingsannonser som registreres i Navs stillingsbase og publiseres på
                arbeidsplassen.no. Retningslinjene gjelder alle typer stillinger/annonser, uansett om stillingen blir
                innhentet elektronisk eller blir registrert av en arbeidsgiver på arbeidsplassen.no.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                2. Stillinger som medfører et ansettelsesforhold - reelle stillinger
            </Heading>
            <BodyLong>
                I Navs stillingsbase skal det i utgangspunktet kun registreres annonser for reelle stillinger, det vil
                si annonser hvor det søkes etter arbeidskraft i den hensikt å opprette et ansettelsesforhold
                (arbeidsgiver-/arbeidstakerforhold). Et ansettelsesforhold er blant annet kjennetegnet ved at
                arbeidsgiver
            </BodyLong>
            <ul>
                <li>
                    <BodyLong>melder arbeidstaker inn i Arbeidsgiver-/arbeidstakerregisteret</BodyLong>
                </li>
                <li>
                    <BodyLong>foretar forskuddstrekk av skatt</BodyLong>
                </li>
                <li>
                    <BodyLong>er ansvarlig for arbeidsmiljøet arbeidstakeren oppholder seg i</BodyLong>
                </li>
            </ul>
            <BodyLong className="mb-12">
                Arbeidsgivere kan ikke kreve noen form for avgift eller annet vederlag fra arbeidssøkere for tilbud om
                ansettelse.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                3. Bemanningsforetak / rekrutteringsbyrå
            </Heading>
            <BodyLong spacing>
                Bemanningsforetak som driver virksomhet i Norge skal være registrert hos Arbeidstilsynet, jf. forskrift
                om bemanningsforetak §§ 5 og 6. For at annonser fra bemanningsforetak/vikarbyråer skal kunne registreres
                i Navs stillingsbase er det en forutsetning at bemanningsforetaket/vikarbyrået er registrert hos
                Arbeidstilsynet.
            </BodyLong>
            <BodyLong spacing>
                Det forekommer at bemanningsforetak/vikarbyråer ønsker å annonsere etter vikarer til sin vikarportefølje
                eller at arbeidsgivere ønsker å annonsere etter godt kvalifiserte arbeidstakere på generelt grunnlag,
                uten at det foreligger noen konkret ledig stilling. Slike annonser kan ikke registreres i Navs
                stillingsbase.
            </BodyLong>
            <BodyLong className="mb-12">
                Hvis et bemanningsforetak/rekrutteringsbyrå annonserer etter arbeidskraft på arbeidsplassen.no på vegne
                av en anonym kunde/arbeidsgiver, kan Nav kreve at bemanningsforetaket/rekrutteringsbyrået oppgir til Nav
                hvem som faktisk skal være arbeidsgiver (men arbeidsgiver får fortsatt være anonym i annonsen). Grunnen
                er at Nav skal kunne kontrollere at arbeidsgiver oppfyller Navs generelle vilkår for publisering av
                stillingsannonser. En slik opplysningsplikt til Nav har også hjemmel i arbeidsmarkedsloven § 7.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                4. Renholdsvirksomheter
            </Heading>
            <BodyLong className="mb-12">
                Renholdsvirksomheter som driver virksomhet i Norge må være godkjent av Arbeidstilsynet, jf. «Forskrift
                om offentlig godkjenning av renholdsvirksomheter og kjøp av renholdstjenester» § 3. For at annonser fra
                renholdsvirksomheter skal kunne registreres i Navs stillingsbase er det en forutsetning at virksomheten
                er godkjent av Arbeidstilsynet.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                5. Virksomheter som tilbyr bilpleie, hjulskift og hjullagring
            </Heading>
            <BodyLong className="mb-12">
                Virksomheter som tilbyr tjenester som bilpleie, hjulskift og hjullagring må være godkjent av
                Arbeidstilsynet jf. «Forskrift om offentlig godkjenning av virksomheter som tilbyr bilpleie, hjulskift
                og hjullagring, og om kjøp av slike tjenester» § 1-4 og § 4-1. For at annonser fra virksomheter som
                tilbyr bilpleie, hjulskift og hjullagring skal kunne registreres i Navs stillingsbase er det en
                forutsetning at virksomheten er godkjent av Arbeidstilsynet.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                6. Oppdrag til selvstendig næringsdrivende
            </Heading>
            <BodyLong spacing>
                Annonser som gjelder oppdrag til selvstendig næringsdrivende, herunder deltakelse i forretningskonsepter
                eller lignende skal ikke registreres i stillingsbasen. Som typiske eksempler på slike oppdrag kan nevnes
                franchise, forhandlere, agenturer, nettverkssalg eller homeparties. Stillingsbasen skal ikke kunne
                benyttes til direkte eller indirekte markedsføring av varer, tjenester og lignende.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Unntak for helsepersonell
            </Heading>
            <BodyLong className="mb-12">
                Annonser som gjelder helsepersonell med offentlig driftsavtale kan registreres i Navs stillingsbase og
                publiseres på arbeidsplassen.no, selv om den som besetter stillingen får status som næringsdrivende.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                7. Annonser med ulovlig diskriminerende innhold
            </Heading>
            <BodyLong spacing>Stillingsannonser som har diskriminerende innhold, skal ikke publiseres.</BodyLong>
            <BodyLong spacing>
                Det er ved ansettelser ulovlig å forskjellsbehandle arbeidssøkere på grunnlag av kjønn, religion,
                livssyn, hudfarge, nasjonal eller etnisk opprinnelse, politisk syn, medlemskap i
                arbeidstakerorganisasjon, seksuell orientering, funksjonshemming eller alder. Forbudet omfatter også
                indirekte diskriminering; for eksempel at det stilles krav om gode norskkunnskaper eller avtjent
                verneplikt, uten at slike krav er nødvendige for å utføre stillingens arbeidsoppgaver på en forsvarlig
                måte.
            </BodyLong>
            <BodyLong spacing>
                Det vises ellers til likestillings- og diskrimineringsloven §§ 6 til 12, arbeidsmiljøloven §§ 13-1 og
                13-2
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Formuleringer som fremmer mangfold
            </Heading>
            <BodyLong className="mb-12">
                Diskrimineringsforbudet i loven er ikke til hinder for at det i stillingsannonser brukes formuleringer
                som kan fremme et personalpolitisk mål om at arbeidsstyrken i størst mulig grad skal gjenspeile
                mangfoldet i befolkningen. I tilfeller hvor et kjønn er underrepresentert i bedriften eller i
                stillingskategorien stillingen gjelder, er det anledning til å oppfordre personer av det
                underrepresenterte kjønn til å søke. På samme måte er det anledning til å ta inn formuleringer hvor
                personer med nedsatt funksjonsevne og minoritetsbakgrunn generelt oppfordres til å søke. Det er
                imidlertid ikke anledning til å oppfordre personer med bestemt(e) nasjonalitet(er) til å søke, selv om
                disse kan sies å være underrepresentert.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                8. Annonser for ulovlig arbeid
            </Heading>
            <BodyLong className="mb-12">
                Annonser hvor stillingen går ut på å utføre ulovlige aktiviteter/arbeid (f.eks. ulovlig spillevirksomhet
                som pokerspill eller pyramidespill), eller hvor det kommer frem av annonseteksten at arbeidsgiver bryter
                bestemmelser i arbeidsmiljøloven knyttet til sikkerhet, arbeidstid, arbeidskontrakt eller liknende, skal
                ikke registreres.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                9. Lovlige stillinger som ikke skal registreres
            </Heading>
            <BodyLong spacing>
                Stillingsannonser for arbeid som omfatter aktiviteter som krever nakenhet eller er av seksuell eller
                pornografisk karakter skal ikke registreres, selv om arbeidet er lovlig. Eksempler på slikt arbeid er
                stripping, toppløs servering og telefonsex. Nav ønsker ikke å registrere slike stillinger, av hensyn til
                personer som kan oppfatte slike annonser som støtende/krenkende.
            </BodyLong>
            <BodyLong className="mb-12">
                Det understrekes samtidig at annonser for stillinger som butikkekspeditør/-selger ikke omfattes av
                sensurbestemmelsen ovenfor. Annonser for slike stillinger skal registreres selv om produkter som kan
                sies å være av seksuell eller pornografisk karakter inngår i sortimentet hos den forretningen som
                annonserer. En forutsetning for registrering av stillingen er likevel at det ikke er grunnlag for å anta
                at forretningen driver ulovlig virksomhet.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                10. Annonser på andre språk enn norsk
            </Heading>
            <BodyLong className="mb-12">
                Annonser som registreres i Navs stillingsbase skal enten være på bokmål, nynorsk, samisk, engelsk,
                svensk eller dansk. Det kan ikke registreres flere annonser for samme stilling på ulike språk. Det er
                virksomhetens ansvar å oversette annonseteksten.{" "}
            </BodyLong>
            <Heading size="large" level="2" spacing>
                11. Siste publiseringsdato (utløpsdato)
            </Heading>
            <BodyLong className="mb-12">
                Utløpsdato for en stilling må ikke settes senere enn 6 måneder etter registreringsdato.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                12. Avpublisering av annonser som ikke oppfyller vilkårene
            </Heading>
            <BodyLong spacing>Nav kontrollerer alle annonser som publiseres på arbeidsplassen.no.</BodyLong>
            <BodyLong spacing>
                Hvis det oppdages annonser på arbeidsplassen.no som ikke oppfyller vilkårene i disse retningslinjene,
                men som likevel er blitt publisert, blir annonsen avpublisert.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Melding til arbeidsgiver når annonser slettes eller avvises
            </Heading>
            <BodyLong spacing>
                Dersom Nav har avpublisert en annonse som er registrert av arbeidsgiver på arbeidsplassen.no, vil Nav ta
                kontakt med arbeidsgiver slik at de kan rette annonsen så den kan bli publisert på nytt.
            </BodyLong>
            <BodyLong className="mb-24">
                Ved avpublisering av stillinger som er elektronisk innhentet vil arbeidsgiver ikke få melding.
            </BodyLong>
        </article>
    );
}
