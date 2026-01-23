import { BodyLong, CopyButton, Heading, List } from "@navikt/ds-react";
import React from "react";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { ListItem } from "@navikt/ds-react/List";

type Props = {
    readonly meta: PageInfo;
};
export default function HvordanFaTilgang({ meta }: Props) {
    return (
        <ArticleWrapper title={meta.title} lang={meta.language}>
            <List as="ol">
                <ListItem>
                    Finn ut kven som kan gi deg tilgang. Du kan starta med å spørja leiaren din. Tilgangen til
                    arbeidsplassen.no sine rekrutteringstenester blir handtert av arbeidsgivarar sjølv i Altinn. Det kan
                    vera nokon i HR, leier, mellomleiar eller nokon på eigarsida i bedrifta di som kan gi deg tilgang.
                </ListItem>
                <ListItem>Kopier lenkja til denne guiden og del med personen som skal gi deg tilgang.</ListItem>
            </List>

            <CopyButton
                copyText="https://arbeidsplassen.nav.no/hvordan-fa-tilgang"
                text="Kopier lenkja til denne sida"
                activeText="Lenke kopiert"
                data-color="accent"
                className="mb-12"
            />

            <Heading level="2" size="large" spacing>
                Personen som skal gi deg tilgang må anten vera
            </Heading>

            <List className="mb-12">
                <ListItem>
                    registrert i Enhetsregisteret som dagleg leiar, styreleiar, bestyrande reiar eller innehavar
                </ListItem>
                <ListItem>registert som hovudadministrator i Altinn eller</ListItem>
                <ListItem>
                    registrert med Altinn-rolle som «Tilgangsstyrer» og i tillegg enten «Stillingsannonser på
                    arbeidsplassen.no», «Lønn og personalmedarbeider» eller «Utfyller/innsender»..
                </ListItem>
            </List>

            <Heading level="2" size="large" spacing>
                Kva må personen som skal gi deg tilgang gjera?
            </Heading>

            <BodyLong>
                Personen som skal gi tilgang må logga inn i Altinn og følgja ein enkel trinn-for-trinn guide.
            </BodyLong>

            <List as="ol">
                <ListItem>Vel verksemda di under "Alle dine aktører"</ListItem>
                <ListItem>Trykk på knappen "Profil" øvst i menyen</ListItem>
                <ListItem>Trykk på "Andre med rettar til verksemda"</ListItem>
                <ListItem>Vel "Legge til ny person eller virksomhet"</ListItem>
                <ListItem>Legg inn personnummeret og etternamnet til personen som skal ha tilgang</ListItem>
                <ListItem>Vel "Gi tilgang til enkelttjenester"</ListItem>
                <ListItem>
                    Skriv «Stillingsannonser på arbeidsplassen.no», så vil alternativet komma opp som eit val. Vel
                    «Stillingsannonser på arbeidsplassen.no». Denne tilgangen gir berre høve til å bruka
                    arbeidsplassen.no sine rekrutteringstenester og ingenting anna.
                </ListItem>
                <ListItem>Bekreft</ListItem>
            </List>

            <BodyLong>
                <AkselNextLink href="/arbeidsgivertjenester">
                    Les meir om tilgangsstyring i verksemder og finn skjermbilete her
                </AkselNextLink>
            </BodyLong>
        </ArticleWrapper>
    );
}
