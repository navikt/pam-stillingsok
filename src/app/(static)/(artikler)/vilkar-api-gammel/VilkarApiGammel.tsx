import { BodyLong, Heading, Link, LinkCard, List } from "@navikt/ds-react";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { ListItem } from "@navikt/ds-react/List";
import { LinkCardTitle } from "@navikt/ds-react/LinkCard";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";

type Props = {
    readonly meta: PageInfo;
};

export default function VilkarApiGammel({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <Heading spacing size="xlarge" level="1">
                {meta.title}
            </Heading>

            <Heading size="large" level="2" spacing>
                Beskrivelse av tjenesten
            </Heading>
            <BodyLong className="mb-12">
                Gjennom arbeidsplassen.no tilbyr Nav data fra stillingssøket på arbeidsplassen.no. Stillingssøket
                inneholder en oversikt og informasjon om de fleste aktive utlyste stillinger. Stillingssøket inneholder
                både stillinger som er registrert direkte hos Nav, publisert til Nav via et åpent API og hentet inn fra
                våre samarbeidspartnere.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Hvem kan bruke tjenestene
            </Heading>
            <BodyLong spacing>
                Alle kan bruke tjenesten. Tjenesten er kostnadsfri og leveres av Nav. Nav forbeholder seg retten til å
                stoppe tilgang ved feil bruk av tjenesten.
            </BodyLong>
            <BodyLong>Feil bruk av tjenesten (ikke uttømmende liste) kan være:</BodyLong>
            <List className="mb-12">
                <ListItem>
                    Ikke sletter stillinger når de løper ut fra dato eller på andre måter blir trukket fra API-et.
                </ListItem>
                <ListItem>Uetisk eller ulovlig bruk av stillingsdataene.</ListItem>
            </List>

            <LinkCard className="arb-link-panel-primary mb-8">
                <LinkCardTitle>
                    <AkselNextLinkCardAnchor href="/vilkar-og-retningslinjer">
                        Gå til Vilkår og retningslinjer
                    </AkselNextLinkCardAnchor>
                </LinkCardTitle>
            </LinkCard>

            <Heading size="large" level="2" spacing>
                Typer tilgang
            </Heading>
            <List as="ol" className="mb-12">
                <ListItem>
                    <b>Tilgang som uregistrert bruker:</b> (Offentlig nøkkel) Denne tilgangen kan du bruke for å prøve
                    ut tjenesten. Ulempen er at vi ikke har mulighet til å informere deg om endringer når den offentlige
                    tilgangsnøkkelen endres uten forvarsel. Hvis du ønsker å bruke tjenesten på fast basis, anbefaler vi
                    alternativ 2.
                </ListItem>
                <ListItem>
                    <b>Tilgang som registrert bruker:</b> (Privat nøkkel) Vi anbefaler denne tilgangen hvis du skal
                    bruke tjenesten på fast basis. Fordelen er at vi kan informere deg når det skjer endringer i
                    tjenesten. Denne tilgangen krever at du oppgir e-postadressen din, navnet ditt og bedriftens navn
                    til <Link href="mailto:nav.team.arbeidsplassen@nav.no">nav.team.arbeidsplassen@nav.no</Link>
                    {". "}
                    Du vil få tilbakemelding i løpet av to virkedager.
                </ListItem>
            </List>

            <Heading size="large" level="2" spacing>
                Slik får du tilgang
            </Heading>
            <BodyLong spacing>
                Mer informasjon om API-et og tilkobling finner du i{" "}
                <Link href="https://data.norge.no/data-services/ed933ffe-a32c-38a2-9921-1fed86ad3173">
                    Datatjenestebeskrivelse i Felles datakatalog.
                </Link>
            </BodyLong>
            <BodyLong className="mb-12">
                Har du spørsmål kan du kontakte oss på e-post{" "}
                <Link href="mailto:nav.team.arbeidsplassen@nav.no">nav.team.arbeidsplassen@nav.no</Link>. Ønsker du å
                avslutte abonnementet, send en henvendelse til samme e-postadresse.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Personvern
            </Heading>
            <BodyLong spacing>
                Nav er gjennom offentlighetsloven og digitaliseringsrundskrivet pålagt å gjøre offentlige data
                tilgjengelig. I retningslinjene går det fram at man bør oppgi kontaktinformasjon.
            </BodyLong>
            <BodyLong>
                For å kunne tilby tilgang som registrert bruker (alternativ 2) må vi lagre nødvendige personopplysninger
                så lenge du/dere benytter tjenesten. Disse opplysningene trenger vi for å kunne komme i kontakt med deg
                senere, for eksempel ved endringer eller driftsavbrudd. Kontaktinformasjonen din blir slettet når du
                ikke lenger har tilgang som registrert bruker. For mer informasjon om personvern,{" "}
                <Link href="https://www.nav.no/personvernerklaering">se Navs personvernerklæring.</Link>
            </BodyLong>
        </ArticleWrapper>
    );
}
