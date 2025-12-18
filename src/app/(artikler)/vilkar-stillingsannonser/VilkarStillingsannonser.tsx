import { BodyLong, Heading, Link, LinkCard, List } from "@navikt/ds-react";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { ListItem } from "@navikt/ds-react/List";
import { LinkCardTitle } from "@navikt/ds-react/LinkCard";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";

type Props = {
    readonly meta: PageInfo;
};

export default function VilkarStillingsannonser({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <Heading spacing size="xlarge" level="1">
                {meta.title}
            </Heading>

            <BodyLong spacing>
                Om du ønskjer å annonsera ledige stillingar på arbeidsplassen.no og{" "}
                <Link href="https://eures.europa.eu/index_en">Den Europeiske Jobbmobilitetsportalen</Link>
                {", "}
                må du som arbeidsgivar godta vilkåra under.
            </BodyLong>
            <BodyLong spacing>
                Stillingsannonsen blir synleg på arbeidsplassen.no få minutt etter at du har sendt den til publisering.
                Nav kontrollerer i etterkant og tek kontakt viss annonsen bryt med vilkåra og blir fjerna, slik at du
                kan retta opp og senda inn for godkjenning på nytt. Alle stillingar publiserte på arbeidsplassen.no,
                blir også delte med Den Europeiske Jobbmobilitetsportalen (EURES-portalen), og er tilgjengeleg i ope API
                for stillingar.
            </BodyLong>
            <BodyLong>Tenesta er kostnadsfri.</BodyLong>
            <List>
                <ListItem>
                    Du kan berre annonsera ei ledig stilling på arbeidsplassen.no når du vil tilby ein kandidat
                    tilsetjing.
                </ListItem>
                <ListItem>
                    Du har ikkje høve til å publisera annonsar til oppdrag for sjølvstendig næringsdrivande eller ulike
                    forretningskonsept som til dømes franchise, forhandlar, agentur, nettverkssal og «homeparty».
                </ListItem>
                <ListItem>
                    Du kan ikkje bruka stillingsannonsen til sal eller marknadsføring av varer, tenester eller liknande.
                </ListItem>
                <ListItem>
                    Om du vil tilby tilsetjing, kan du ikkje krevja noka form for avgift eller anna godtgjersle frå
                    arbeidssøkjaren.
                </ListItem>
                <ListItem>
                    Stillingsannonsen din skal gi arbeidssøkjaren tilstrekkeleg informasjon om verksemda,
                    arbeidsoppgåver, godtgjersle og tilsetjingsforhold.
                </ListItem>
                <ListItem>
                    Stillingsannonsen skal ikkje forskjellsbehandla ut frå kjønn, alder, etnisk bakgrunn eller andre
                    kriterium som ikkje er relevante. Annonsen skal heller ikkje ha uetisk innhald eller vera støytande.
                    Den skal ikkje oppmoda til ulovlege handlingar eller vera i strid med norsk lov eller{" "}
                    <AkselNextLink href="/retningslinjer-stillingsannonser">
                        Navs retningslinjer for innhald i stillingsannonsar.
                    </AkselNextLink>{" "}
                </ListItem>
                <ListItem>
                    For nokre stillingar, som t.d. personleg assistent, kan det vera aktuelt å presisera i kva grad
                    brukaren er avhengig av hjelp. I slike tilfelle kan det beskrivast om stillinga inneber tunge løft,
                    bistand til morgon/kveldsstell o.l., så lenge det ikkje er mogleg å identifisera brukaren.
                </ListItem>
                <ListItem>
                    Stillingsannonsen skal i utgangspunktet berre publiserast éin gong. Hyppige endringar av annonsen
                    med det formålet å komma høgare opp i stillingssøket er ikkje tillate.
                </ListItem>
            </List>
            <BodyLong className="mb-12">
                Viss Nav oppdagar ein annonse som ikkje oppfyller vilkåra, kan han bli sletta eller fjerna utan
                varsling. Nav vil ta kontakt og informera i etterkant.
            </BodyLong>

            <LinkCard className="arb-link-panel-primary mb-8">
                <LinkCardTitle>
                    <AkselNextLinkCardAnchor href="/vilkar-og-retningslinjer">
                        Gå til Vilkår og retningslinjer
                    </AkselNextLinkCardAnchor>
                </LinkCardTitle>
            </LinkCard>

            <Heading size="medium" level="2" spacing>
                Personopplysningar
            </Heading>
            <BodyLong>
                Nav er pålagde å driva ei statleg arbeidsformidling og formidla arbeidskraft. For å kunna tilby desse
                tenestene til arbeidsgivarar, må me lagra nødvendige personopplysningar knytt til kven som lagar
                stillingsannonsen, og kontaktperson til stillinga. Me lagrar desse opplysningane:
            </BodyLong>
            <List>
                <ListItem>
                    Stillingar som verksemda har publisert på arbeidsplassen.no, under dette personopplysningar du har
                    oppgitt. Annonsane blir arkiverte og anonymiserte opplysningar blir brukte til statistiske formål.
                </ListItem>
                <ListItem>
                    Så lenge stillingsannonsen er aktiv, blir den delt i eit ope API som tredjepartar kan nytta seg av,
                    til dømes rekrutterings- og bemanningsbransjen.
                </ListItem>
                <ListItem>Informasjon om kven i verksemda som registrerer og redigerer annonsen.</ListItem>
            </List>
            <BodyLong spacing>
                For meir informasjon,{" "}
                <AkselNextLink href="/arbeidsgivertjenester">sjå Navs personvernerklæring.</AkselNextLink>
            </BodyLong>
            <BodyLong className="mb-24">
                Har du spørsmål, ta gjerne kontakt med oss:{" "}
                <Link href="https://www.nav.no/arbeidsgiver/kontaktoss">Kontakt Nav - arbeidsgivar</Link>
            </BodyLong>
        </ArticleWrapper>
    );
}
