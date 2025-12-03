import { BodyLong, Heading } from "@navikt/ds-react";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type Props = {
    readonly meta: PageInfo;
};

export default function VilkarOgRetningslinjer({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title}>
            <Heading size="large" level="2" spacing>
                Vilkår for å bruke arbeidsgivartenestene på arbeidsplassen.no
            </Heading>
            <BodyLong>
                Arbeidsplassen.no er ei kostnadsfri teneste frå Nav. Arbeidsgivarar må godta fleire vilkår for å bruke
                tenestene på arbeidsplassen.no. Nokre generelle vilkår vi ønskjer å trekkje fram er:
            </BodyLong>
            <ul className="mb-12">
                <li>
                    <BodyLong>
                        Stillingsannonsar som arbeidsgivar publiserer, må følgje{" "}
                        <AkselNextLink inlineText href="/retningslinjer-stillingsannonser">
                            retningslinjene for innhald i stillingsannonsar
                        </AkselNextLink>
                        .
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        For å bruke tenestene på arbeidsplassen.no må verksemda ha eit reelt rekrutteringsbehov.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Alle personopplysningar du får frå jobbsøkjarar skal behandlast til formålet rekruttering, og
                        slettast ved avslutta rekrutteringsprosess.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>Personopplysningar om jobbsøkjarar kan ikkje brukast til marknadsføring.</BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Bruk av automatiserte tenester (robotar, spiders, indeksering m.m.) eller andre metodar for
                        systematisk eller regelmessig kopiering av innhaldet på arbeidsplassen.no er ikkje tillaten utan
                        uttrykkeleg skriftleg samtykke frå Nav.
                    </BodyLong>
                </li>
            </ul>

            <Heading size="medium" level="3" spacing>
                Kven kan bruke tenestene
            </Heading>
            <BodyLong spacing>
                Arbeidsgivar får ikkje tilgang til å bruke tenestene utan nødvendige rettar tildelte i Altinn.
            </BodyLong>
            <BodyLong className="mb-12">
                <AkselNextLink href="/arbeidsgivertjenester">
                    Kven kan bruke arbeidsgivartenestene på arbeidsplassen.no
                </AkselNextLink>
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Personopplysningar
            </Heading>
            <BodyLong spacing>
                Nav er pålagt å drive statleg arbeidsformidling og formidle arbeidskraft. For å kunne tilby desse
                tenestene til arbeidsgivarar, må vi lagre nødvendige personopplysningar. Vi lagrar:
            </BodyLong>
            <ul>
                <li>
                    <BodyLong>
                        Stillingar som verksemda har publisert på arbeidsplassen.no, inkludert personopplysningar du har
                        oppgitt. Annonsane blir arkiverte, og anonymiserte opplysningar blir brukte til statistiske
                        formål.
                    </BodyLong>
                </li>
            </ul>
            <BodyLong spacing>
                For meir informasjon,{" "}
                <AkselNextLink href="/arbeidsgivertjenester">sjå Nav si personvernerklæring.</AkselNextLink>
            </BodyLong>
            <BodyLong className="mb-12">
                Har du spørsmål, ta gjerne kontakt med oss:{" "}
                <AkselNextLink href="https://www.nav.no/arbeidsgiver/kontaktoss" inlineText>
                    Kontakt Nav - arbeidsgivar
                </AkselNextLink>
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Vilkår for å publisere stillingsannonsar
            </Heading>
            <BodyLong spacing>
                For å annonsere ledige stillingar på arbeidsplassen.no og Den Europeiske Jobbmobilitetsportalen, må du
                mellom anna ha ei konkret stilling du ønskjer å tilsetje til. Stillingsannonsen kan ikkje
                forskjellsbehandle ut frå kjønn, alder, etnisk bakgrunn eller andre kriterium som ikkje er relevante for
                stillinga.
            </BodyLong>
            <BodyLong spacing>
                Det skal ikkje publiserast stillingsannonsar som inneheld sensitive eller teiepliktige opplysningar om
                personar.
            </BodyLong>
            <BodyLong spacing>
                Viss Nav oppdagar ein annonse som ikkje oppfyller vilkåra, kan han bli sletta eller fjerna utan
                varsling. Nav vil ta kontakt og informere i etterkant.
            </BodyLong>
            <BodyLong className="mb-12">
                <AkselNextLink href="/vilkar-stillingsannonser">
                    Vilkår for å publisere stillingsannonsar på arbeidsplassen.no
                </AkselNextLink>
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Vilkår for bruk av superrask søknad
            </Heading>
            <BodyLong spacing>
                Personopplysninger som du får frå jobbsøkjarar i “superrask søknad” kan berre brukast så lenge formålet
                er å bemanne og rekruttere til ei konkret stilling.
            </BodyLong>
            <BodyLong className="mb-12">
                <AkselNextLink href="/vilkar-superrask-soknad">
                    Vilkår for bruk av superrask søknad på arbeidsplassen.no
                </AkselNextLink>
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Vilkår for bruk av API for stillingsannonsar
            </Heading>
            <BodyLong spacing>
                Gjennom arbeidsplassen.no tilbyr Nav data frå stillingssøket på arbeidsplassen.no. Stillingssøket
                inneheld ei oversikt og informasjon om dei fleste aktive kunngjorde stillingar. Stillingssøket inneheld
                både stillingar som er registrerte direkte hos Nav, publisert til Nav via eit ope API og henta inn frå
                samarbeidspartnarane våre.
            </BodyLong>
            <BodyLong className="mb-24">
                <AkselNextLink href="/vilkar-api">
                    Vilkår for bruk av API for stillingsannonsar på arbeidsplassen.no
                </AkselNextLink>
            </BodyLong>
        </ArticleWrapper>
    );
}
