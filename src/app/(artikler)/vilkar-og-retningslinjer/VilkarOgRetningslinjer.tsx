import { BodyLong, Heading, Link, List } from "@navikt/ds-react";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { ListItem } from "@navikt/ds-react/List";

type Props = {
    readonly meta: PageInfo;
};

export default function VilkarOgRetningslinjer({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title}>
            <Heading size="large" level="2" spacing>
                Vilkår for å bruke arbeidsgivertjenestene på arbeidsplassen.no
            </Heading>
            <BodyLong className="mb-4">
                Arbeidsplassen.no er en kostnadsfri tjeneste fra Nav. Arbeidsgivere må godta flere vilkår for å benytte
                tjenestene på arbeidsplassen.no. Generelle vilkår vi ønsker å trekke frem er:
            </BodyLong>
            <List className="mb-12">
                <ListItem>
                    Stillingsannonser som arbeidsgiver skal publisere, må følge{" "}
                    <AkselNextLink href="/retningslinjer-stillingsannonser" inlineText>
                        retningslinjene for innhold i stillingsannonser
                    </AkselNextLink>
                    .
                </ListItem>
                <ListItem>
                    For å benytte tjenestene på arbeidsplassen.no, må bedriften ha et generelt rekrutteringsbehov.
                </ListItem>
                <ListItem>
                    Enhver personopplysning du mottar fra jobbsøkere må behandles til formålet om rekruttering, og
                    slettes ved endt rekrutteringsprosess.
                </ListItem>
                <ListItem>Personopplysninger om jobbsøkere, kan ikke brukes til markedsføring.</ListItem>
                <ListItem>
                    Bruk av automatiserte tjenester (roboter, spidere, indeksering m.m.) samt andre fremgangsmåter for
                    systematisk eller regelmessig kopi av innholdet på arbeidsplassen.no er ikke tillatt uten eksplisitt
                    skriftlig samtykke fra Nav.
                </ListItem>
            </List>

            <Heading size="medium" level="3" spacing>
                Hvem kan bruke tjenestene
            </Heading>
            <BodyLong spacing>
                Arbeidsgiver vil ikke få tilgang til å bruke tjenesten uten riktig tilganger som er tildelt i Altinn.
            </BodyLong>
            <BodyLong className="mb-12">
                <AkselNextLink href="/arbeidsgivertjenester">
                    Hvem kan bruke arbeidsgivertjenestene på arbeidsplassen.no
                </AkselNextLink>
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Personopplysninger
            </Heading>
            <BodyLong className="mb-4">
                Nav er pålagt å drive en statlig arbeidsformidling og formidle arbeidskraft. For å kunne tilby disse
                tjenestene til arbeidsgivere, må vi lagre nødvendige personopplysninger. Vi lagrer disse opplysningene:
            </BodyLong>
            <List className="mb-6">
                <ListItem>
                    Stillinger som virksomheten har publisert på arbeidsplassen.no, herunder personopplysninger du har
                    oppgitt. Annonsene arkiveres og anonymiserte opplysninger brukes til statistiske formål.
                </ListItem>
            </List>
            <BodyLong spacing>
                For mer informasjon,{" "}
                <AkselNextLink href="/arbeidsgivertjenester">se Navs personvernerklæring.</AkselNextLink>
            </BodyLong>
            <BodyLong className="mb-12">
                Har du spørsmål, ta gjerne kontakt med oss:{" "}
                <Link href="https://www.nav.no/arbeidsgiver/kontaktoss" inlineText>
                    Kontakt Nav - arbeidsgiver
                </Link>
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Vilkår for å publisere stillingsannonser
            </Heading>
            <BodyLong spacing>
                For å annonsere ledige stillinger på arbeidsplassen.no og Den Europeiske Jobbmobilitetsportalen, må du
                blant annet ha en konkret stilling du ønsker å ansette til. Stillingsannonsen kan ikke
                forskjellsbehandle ut fra kjønn, alder, etnisk bakgrunn eller andre kriterier som ikke er relevante for
                stillingen.
            </BodyLong>
            <BodyLong spacing>
                Det skal ikke publiseres stillingsannonser som inneholder sensitive eller taushetsbelagte opplysninger
                om personer.
            </BodyLong>
            <BodyLong spacing>
                Hvis Nav oppdager en annonse som ikke oppfyller vilkårene, kan den bli slettet eller fjernet uten
                varsling. Nav vil ta kontakt og informere i etterkant.
            </BodyLong>
            <BodyLong className="mb-12">
                <AkselNextLink href="/vilkar-stillingsannonser">
                    Vilkår for å publisere stillingsannonser på arbeidsplassen.no
                </AkselNextLink>
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Vilkår for bruk av superrask søknad
            </Heading>
            <BodyLong spacing>
                Personopplysninger som du mottar fra jobbsøkere i “superrask søknad” kan kun brukes så lenge formålet er
                å bemanne og rekruttere til en konkret stilling.
            </BodyLong>
            <BodyLong className="mb-12">
                <AkselNextLink href="/vilkar-superrask-soknad">
                    Vilkår for bruk av superrask søknad på arbeidsplassen.no
                </AkselNextLink>
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Vilkår for bruk av API for stillingsannonser
            </Heading>
            <BodyLong spacing>
                Gjennom arbeidsplassen.no tilbyr Nav data fra stillingssøket på arbeidsplassen.no. Stillingssøket
                inneholder en oversikt og informasjon om de fleste aktive utlyste stillinger. Stillingssøket inneholder
                både stillinger som er registrert direkte hos Nav, publisert til Nav via et åpent API og hentet inn fra
                våre samarbeidspartnere.
            </BodyLong>
            <BodyLong className="mb-24">
                <AkselNextLink href="/vilkar-api">
                    Vilkår for bruk av API for stillingsannonser på arbeidsplassen.no
                </AkselNextLink>
            </BodyLong>
        </ArticleWrapper>
    );
}
