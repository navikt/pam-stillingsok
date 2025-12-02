import { BodyLong, BodyShort, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";

type Props = {
    readonly meta: PageInfo;
};

export default function VilkarStillingsannonser({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <AkselLink as={NextLink} href="/vilkar-og-retningslinjer" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                <BodyShort>Til Vilkår og retningslinjer</BodyShort>
            </AkselLink>

            <Heading spacing size="xlarge" level="1">
                {meta.title}
            </Heading>

            <BodyLong spacing>
                Om du ønskjer å annonsera ledige stillingar på arbeidsplassen.no og{" "}
                <AkselLink href="https://eures.europa.eu/index_en">Den Europeiske Jobbmobilitetsportalen</AkselLink>
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
            <ul>
                <li>
                    <BodyLong>
                        Du kan berre annonsera ei ledig stilling på arbeidsplassen.no når du vil tilby ein kandidat
                        tilsetjing.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Du har ikkje høve til å publisera annonsar til oppdrag for sjølvstendig næringsdrivande eller
                        ulike forretningskonsept som til dømes franchise, forhandlar, agentur, nettverkssal og
                        «homeparty».
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Du kan ikkje bruka stillingsannonsen til sal eller marknadsføring av varer, tenester eller
                        liknande.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Om du vil tilby tilsetjing, kan du ikkje krevja noka form for avgift eller anna godtgjersle frå
                        arbeidssøkjaren.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Stillingsannonsen din skal gi arbeidssøkjaren tilstrekkeleg informasjon om verksemda,
                        arbeidsoppgåver, godtgjersle og tilsetjingsforhold.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Stillingsannonsen skal ikkje forskjellsbehandla ut frå kjønn, alder, etnisk bakgrunn eller andre
                        kriterium som ikkje er relevante. Annonsen skal heller ikkje ha uetisk innhald eller vera
                        støytande. Den skal ikkje oppmoda til ulovlege handlingar eller vera i strid med norsk lov eller{" "}
                        <AkselLink as={NextLink} href="/retningslinjer-stillingsannonser">
                            Navs retningslinjer for innhald i stillingsannonsar.
                        </AkselLink>{" "}
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        For nokre stillingar, som t.d. personleg assistent, kan det vera aktuelt å presisera i kva grad
                        brukaren er avhengig av hjelp. I slike tilfelle kan det beskrivast om stillinga inneber tunge
                        løft, bistand til morgon/kveldsstell o.l., så lenge det ikkje er mogleg å identifisera brukaren.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Stillingsannonsen skal i utgangspunktet berre publiserast éin gong. Hyppige endringar av
                        annonsen med det formålet å komma høgare opp i stillingssøket er ikkje tillate.
                    </BodyLong>
                </li>
            </ul>
            <BodyLong className="mb-12">
                Viss Nav oppdagar ein annonse som ikkje oppfyller vilkåra, kan han bli sletta eller fjerna utan
                varsling. Nav vil ta kontakt og informera i etterkant.
            </BodyLong>

            <Heading size="medium" level="2" spacing>
                Personopplysningar
            </Heading>
            <BodyLong>
                Nav er pålagde å driva ei statleg arbeidsformidling og formidla arbeidskraft. For å kunna tilby desse
                tenestene til arbeidsgivarar, må me lagra nødvendige personopplysningar knytt til kven som lagar
                stillingsannonsen, og kontaktperson til stillinga. Me lagrar desse opplysningane:
            </BodyLong>
            <ul>
                <li>
                    <BodyLong>
                        Stillingar som verksemda har publisert på arbeidsplassen.no, under dette personopplysningar du
                        har oppgitt. Annonsane blir arkiverte og anonymiserte opplysningar blir brukte til statistiske
                        formål.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Så lenge stillingsannonsen er aktiv, blir den delt i eit ope API som tredjepartar kan nytta seg
                        av, til dømes rekrutterings- og bemanningsbransjen.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>Informasjon om kven i verksemda som registrerer og redigerer annonsen.</BodyLong>
                </li>
            </ul>
            <BodyLong spacing>
                For meir informasjon,{" "}
                <AkselLink as={NextLink} href="/arbeidsgivertjenester">
                    sjå Navs personvernerklæring.
                </AkselLink>
            </BodyLong>
            <BodyLong className="mb-24">
                Har du spørsmål, ta gjerne kontakt med oss:{" "}
                <AkselLink href="https://www.nav.no/arbeidsgiver/kontaktoss">Kontakt Nav - arbeidsgivar</AkselLink>
            </BodyLong>
        </ArticleWrapper>
    );
}
