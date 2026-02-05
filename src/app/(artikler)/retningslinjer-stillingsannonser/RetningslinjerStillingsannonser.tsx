import { BodyLong, Heading, LinkCard, List } from "@navikt/ds-react";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { ListItem } from "@navikt/ds-react/List";
import { LinkCardTitle } from "@navikt/ds-react/LinkCard";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";

type Props = {
    readonly meta: PageInfo;
};

export default function RetningslinjerStillingsannonser({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <Heading spacing size="xlarge" level="1">
                {meta.title}
            </Heading>

            <Heading size="large" level="2" spacing>
                1. Innleiing
            </Heading>
            <BodyLong className="mb-12">
                Formålet med desse retningslinjene er å bidra til kvalitetssikring av Nav si stillingsbase, slik at Nav
                best mogleg kan fylle si oppgåve som møteplass for arbeidsgivarar og arbeidssøkjarar. Retningslinjene
                angir generelle krav til innhald i stillingsannonsar som blir registrerte i Nav si stillingsbase og
                publiserte på arbeidsplassen.no. Dei gjeld for alle typar stillingar/annonsar, uavhengig av om stillinga
                blir henta inn elektronisk eller registrert av arbeidsgivar på arbeidsplassen.no.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                2. Stillingar som medfører eit tilsetjingsforhold – reelle stillingar
            </Heading>
            <BodyLong className="mb-4">
                I Nav si stillingsbase skal det i utgangspunktet berre registrerast annonsar for reelle stillingar,
                altså der det blir søkt etter arbeidskraft med mål om å opprette eit tilsetjingsforhold. Eit
                tilsetjingsforhold er kjenneteikna ved at arbeidsgivar:
            </BodyLong>
            <List className="mb-6" aria-label="Et ansettelsesforhold er blant annet kjennetegnet ved at arbeidsgiver:">
                <ListItem>melder arbeidstakar inn i Arbeidsgivar-/arbeidstakarregisteret</ListItem>
                <ListItem>gjennomfører forskotstrekk av skatt</ListItem>
                <ListItem>har ansvar for arbeidsmiljøet arbeidstakaren oppheld seg i</ListItem>
            </List>
            <BodyLong className="mb-12">
                Arbeidsgivarar kan ikkje krevje nokon form for betaling eller vederlag frå arbeidssøkjarar for tilbod om
                tilsetjing.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                3. Bemanningsføretak / rekrutteringsbyrå
            </Heading>
            <BodyLong spacing>
                Bemanningsføretak som driv verksemd i Noreg skal vere registrert hos Arbeidstilsynet, jf. forskrift om
                bemanningsføretak §§ 5 og 6. For at annonsar frå bemanningsføretak/vikarbyrå skal kunne registrerast i
                Nav si stillingsbase, må dei vere registrerte hos Arbeidstilsynet.
            </BodyLong>
            <BodyLong spacing>
                Annonsar som gjeld generelle søk etter vikarar eller kvalifiserte arbeidstakarar utan konkret stilling,
                skal ikkje registrerast.
            </BodyLong>
            <BodyLong className="mb-12">
                Dersom bemanningsføretak annonserer på vegner av anonym kunde, kan Nav krevje å få vite kven som faktisk
                er arbeidsgivar (men arbeidsgivar kan framleis vere anonym i annonsen). Dette er for å kontrollere at
                arbeidsgivar oppfyller Nav sine vilkår, jf. arbeidsmarknadslova § 7.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                4. Reinhaldsverksemder
            </Heading>
            <BodyLong className="mb-12">
                Reinhaldsverksemder må vere godkjende av Arbeidstilsynet, jf. forskrift om godkjenning av
                reinhaldsverksemder § 3. Annonsar frå slike verksemder kan berre registrerast dersom verksemda er
                godkjend.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                5. Verksemder som tilbyr bilpleie, hjulskift og hjullagring
            </Heading>
            <BodyLong className="mb-12">
                Verksemder som tilbyr desse tenestene må vere godkjende av Arbeidstilsynet, jf. forskrift om godkjenning
                av verksemder som tilbyr bilpleie, hjulskift og hjullagring §§ 1-4 og 4-1. Annonsar frå slike verksemder
                kan berre registrerast dersom godkjenning føreligg.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                6. Oppdrag til sjølvstendig næringsdrivande
            </Heading>
            <BodyLong spacing>
                Annonsar som gjeld oppdrag til sjølvstendig næringsdrivande, som franchise, agentur, nettverkssal eller
                homeparties, skal ikkje registrerast. Stillingsbasen skal ikkje brukast til direkte eller indirekte
                marknadsføring av varer eller tenester.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Unntak for helsepersonell:
            </Heading>
            <BodyLong className="mb-12">
                Annonsar for helsepersonell med offentleg driftsavtale kan registrerast, sjølv om den som får stillinga
                er næringsdrivande.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                7. Annonsar med ulovleg diskriminerande innhald
            </Heading>
            <BodyLong spacing>
                Annonsar med diskriminerande innhald skal ikkje publiserast. Det er ulovleg å forskjellsbehandle
                arbeidssøkjarar på grunnlag av kjønn, religion, livssyn, etnisitet, politisk syn, medlemskap i
                fagforeining, seksuell orientering, funksjonsnedsetting eller alder.
            </BodyLong>
            <BodyLong spacing>
                Indirekte diskriminering, som krav om gode norskkunnskapar eller avtjent verneplikt utan at det er
                nødvendig for jobben, er også forbode.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Mangfaldsformuleringar:
            </Heading>
            <BodyLong className="mb-12">
                Det er lov å oppmode underrepresenterte grupper til å søkje, som kvinner, personar med nedsett
                funksjonsevne eller minoritetsbakgrunn. Det er ikkje lov å oppmode personar med bestemte nasjonalitetar
                til å søkje.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                8. Annonsar for ulovleg arbeid
            </Heading>
            <BodyLong className="mb-12">
                Annonsar som gjeld ulovleg aktivitet, som pokerspel eller pyramidespel, eller der arbeidsgivar bryt
                arbeidsmiljølova, skal ikkje registrerast.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                9. Lovlege stillingar som ikkje skal registrerast
            </Heading>
            <BodyLong spacing>
                Stillingar som inneber nakenheit eller arbeid av seksuell/pornografisk karakter, som stripping eller
                telefonsex, skal ikkje registrerast – sjølv om arbeidet er lovleg.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Unntak:
            </Heading>
            <BodyLong className="mb-12">
                Stillingar som butikkmedarbeidar skal registrerast, sjølv om butikken sel produkt med seksuell karakter,
                så lenge verksemda ikkje driv ulovleg.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                10. Sensitive eller teiepliktige opplysningar
            </Heading>
            <BodyLong className="mb-12">
                Annonsar skal ikkje innehalde sensitive eller teiepliktige opplysningar om personar.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                11. Annonsar på andre språk enn norsk
            </Heading>
            <BodyLong className="mb-12">
                Annonsar må vere på bokmål, nynorsk, samisk, engelsk, svensk eller dansk. Det kan ikkje registrerast
                fleire språkversjonar av same stilling. Verksemda har ansvar for å oversette teksten.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                12. Siste publiseringsdato (utløpsdato)
            </Heading>
            <BodyLong className="mb-12">
                Utløpsdato må ikkje setjast lenger enn 6 månader etter registreringsdato.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                13. Avpublisering av annonsar som ikkje oppfyller vilkåra
            </Heading>
            <BodyLong spacing>
                Nav kontrollerer alle annonsar på arbeidsplassen.no. Dersom ein annonse ikkje oppfyller vilkåra, blir
                han avpublisert.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Melding til arbeidsgivar:
            </Heading>
            <BodyLong spacing>
                Dersom arbeidsgivar har registrert annonsen sjølv, vil Nav ta kontakt slik at annonsen kan rettast og
                publiserast på nytt.
            </BodyLong>
            <BodyLong spacing>
                Ved elektronisk innhenta annonsar blir det ikkje sendt melding ved avpublisering.
            </BodyLong>
            <LinkCard className="arb-link-panel-primary">
                <LinkCardTitle>
                    <AkselNextLinkCardAnchor href="/vilkar-og-retningslinjer">
                        Til Vilkår og retningslinjer
                    </AkselNextLinkCardAnchor>
                </LinkCardTitle>
            </LinkCard>
        </ArticleWrapper>
    );
}
