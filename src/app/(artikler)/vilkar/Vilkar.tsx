import { BodyLong, Heading, Link, List } from "@navikt/ds-react";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { ListItem } from "@navikt/ds-react/List";

type Props = {
    readonly meta: PageInfo;
};
export default function Vilkar({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <Heading spacing size="xlarge" level="1">
                {meta.title}
            </Heading>

            <Heading size="large" level="2" spacing>
                Kven kan bruke tenestene
            </Heading>
            <BodyLong className="mb-12">
                Arbeidsgiveren i ei verksemd gir tilgangar til sine tilsette i Altinn. Har fleire tilsette fått tilgang
                til å publisere stillingar på arbeidsplassen.no, kan dei sjå og utføre det same, også endre det som ein
                annan har lagt inn.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Bruk av opplysningar i CV-er
            </Heading>
            <BodyLong spacing>
                Du kan berre bruke opplysningar i CV-er viss målet er å bemanne, rekruttere eller oppmode personar til å
                søkje på stillingar.
            </BodyLong>
            <BodyLong>Det er ikkje tillate å bruke CV-er til andre formål, slik som å</BodyLong>
            <List>
                <ListItem>bruke opplysningar i samband med sal eller marknadsføring av varer eller tenester</ListItem>
                <ListItem>tilby arbeidssøkjarar stillingar der arbeidssøkjaren må betale for å søkje</ListItem>
                <ListItem>tilby personar arbeidstreningsplassar</ListItem>
            </List>
            <BodyLong className="mb-12">Nav vil følgje opp brot på desse vilkåra dersom det førekjem.</BodyLong>

            <Heading size="large" level="2" spacing>
                Publisere stillingar
            </Heading>
            <BodyLong spacing>
                Om du ønskjer å annonsere ledige stillingar på arbeidsplassen.no og{" "}
                <Link href="https://eures.europa.eu/index_en">Den Europeiske Jobbmobilitetsportalen</Link>, må du som
                arbeidsgivar godta vilkåra under.
            </BodyLong>
            <BodyLong>
                Stillingsannonsen blir synleg på arbeidsplassen.no få minutt etter at du har sendt den til publisering.
                Nav kontrollerer i etterkant og tek kontakt viss annonsen bryt med vilkåra og blir fjerna, slik at du
                kan rette opp og sende inn for godkjenning på nytt. Tenesta er kostnadsfri.
            </BodyLong>
            <List>
                <ListItem>
                    Du kan berre annonsere ei ledig stilling på arbeidsplassen.no når du vil tilby ein kandidat
                    tilsetjing.
                </ListItem>
                <ListItem>
                    Når du tilset ein person betyr det at du skal melde arbeidstakaren inn i Arbeidsgjevar- og
                    arbeidstakarregisteret.
                </ListItem>
                <ListItem>
                    Du har ikkje høve til å publisere annonsar til oppdrag for sjølvstendig næringsdrivande eller ulike
                    forretningskonsept som til dømes franchise, forhandlar, agentur, nettverkssal og «homeparty».
                </ListItem>
                <ListItem>
                    Du kan ikkje bruke stillingsannonsen til sal eller marknadsføring av varer, tenester eller liknande.
                </ListItem>
                <ListItem>
                    Om du vil tilby tilsetjing, kan du ikkje krevje noka form for avgift eller anna godtgjersle frå
                    arbeidssøkjaren.
                </ListItem>
                <ListItem>
                    Stillingsannonsen din skal gi arbeidssøkjaren tilstrekkeleg informasjon om verksemda,
                    arbeidsoppgåver, godtgjersle og tilsetjingsforhold.
                </ListItem>
                <ListItem>
                    Stillingsannonsen skal ikkje forskjellsbehandle ut frå kjønn, alder, etnisk bakgrunn eller andre
                    kriterium som ikkje er relevante. Annonsen skal heller ikkje ha uetisk innhald eller kunne støyte
                    nokon. Den skal ikkje oppmode til ulovlege handlingar eller vere i strid med norsk lov eller{" "}
                    <AkselNextLink href="/retningslinjer-stillingsannonser">
                        Navs retningslinjer for stillingsannonsar.
                    </AkselNextLink>
                </ListItem>
            </List>
            <BodyLong className="mb-12">
                Viss Nav oppdagar ein annonse som ikkje fyller vilkåra når vi kontrollerer innhaldet, eller etter at
                annonsen er publisert, kan han bli sletta eller fjerna utan varsling. Nav vil ta kontakt og informere i
                etterkant.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Personopplysningar
            </Heading>
            <BodyLong>
                Nav er pålagde å drive ei statleg arbeidsformidling og formidle arbeidskraft. For å kunne tilby desse
                tenestene til arbeidsgivarar, må vi lagre nødvendige personopplysningar. Vi lagrar desse opplysningane:
            </BodyLong>
            <List className="mb-8">
                <ListItem>
                    Stillingar som verksemda har publisert på arbeidsplassen.no, under dette personopplysningar du har
                    oppgitt. Annonsane blir arkiverte og anonymiserte opplysningar blir brukte til statistiske formål.
                </ListItem>
                <ListItem>
                    Kandidatlister som verksemda har oppretta, og anonymiserte opplysningar frå desse. Denne
                    informasjonen bruker Nav til å forbetre tenesta.
                </ListItem>
            </List>
            <BodyLong spacing>
                For meir informasjon,{" "}
                <Link href="https://www.nav.no/personvernerklaering">sjå Navs personvernerklæring.</Link>
            </BodyLong>
            <BodyLong>
                Har du spørsmål, ta gjerne kontakt med oss:{" "}
                <Link href="https://www.nav.no/arbeidsgiver/kontaktoss">Kontakt Nav – arbeidsgivar.</Link>
            </BodyLong>
        </ArticleWrapper>
    );
}
