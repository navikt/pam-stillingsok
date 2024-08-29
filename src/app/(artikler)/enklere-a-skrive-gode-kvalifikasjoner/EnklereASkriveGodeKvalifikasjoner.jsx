import { BodyLong, Heading, Link as AkselLink, LinkPanel, List } from "@navikt/ds-react";
import React from "react";
import Link from "next/link";
import { ListItem } from "@navikt/ds-react/List";
import { LinkPanelTitle } from "@navikt/ds-react/LinkPanel";

export default function EnklereASkriveGodeKvalifikasjoner() {
    return (
        <div className="mt-5 mb-24">
            <div className="container-small">
                <Heading size="xlarge" level="1" spacing>
                    Nå er det enklere enn noensinne å skrive gode kvalifikasjoner og overskrifter til din jobbannonse
                </Heading>
                <BodyLong size="large" spacing>
                    Arbeidsgivere som oppretter en annonse på arbeidsplassen.no, kan nå få forslag til kvalifikasjoner
                    og overskrifter ved hjelp av kunstig intelligens.
                </BodyLong>
            </div>
            <div className="container-medium mb-12">
                <img
                    className="article-image"
                    src="/images/dog.png"
                    alt="Glad hund som som sitter ved kjøkkenbordet og ser på en person som fyller ut superrask søknad."
                />
            </div>
            <div className="container-small">
                <BodyLong spacing>
                    Vi ønsker å gjøre det enklere for arbeidsgivere å formidle hva de ser etter, og for jobbsøkere å
                    vurdere om de er aktuelle for en stilling. Derfor har vi nå lansert tjenester som benytter seg av KI
                    (kunstig intelligens) til å foreslå gode kvalifikasjoner og overskrifter basert på informasjonen som
                    du har lagt inn i jobbannonsen.
                </BodyLong>
                <Heading size="large" level="2" spacing>
                    Slik fungerer det
                </Heading>
                <List title="For kvalifikasjoner" headingTag="h3" className="mb-6">
                    <ListItem>
                        Når du velger å{" "}
                        <AkselLink as={Link} href="/superrask-soknad-bedrift">
                            motta søknader med superrask søknad
                        </AkselLink>
                        , kan du få forslag på kvalifikasjoner basert på annonseteksten du har skrevet inn.
                    </ListItem>
                    <ListItem>Vi bruker kun teksten om stillingen for å foreslå kvalifikasjoner.</ListItem>
                </List>
                <List title="For overskrifter" headingTag="h3" className="mb-12">
                    <ListItem>
                        Du kan velge å få forslag til overskrift basert på yrke, geografi og annonseteksten du har
                        skrevet inn.
                    </ListItem>
                    <ListItem>
                        Forslagene kan brukes som de blir foreslått eller som inspirasjon hvis du vil lage en egen
                        overskrift.
                    </ListItem>
                </List>
                <BodyLong spacing>Det er helt frivillig å ta i bruk disse tjenestene.</BodyLong>
                <BodyLong spacing>
                    Din informasjon vil ikke brukes til å trene KI eller sendes videre til andre aktører. Tjenestene vil
                    følge og sikre{" "}
                    <AkselLink as={Link} href="/retningslinjer-stillingsannonser">
                        våre retningslinjer
                    </AkselLink>{" "}
                    for diskriminerende innhold, som for eksempel kjønn, etnisitet og alder.
                </BodyLong>
                <BodyLong className="mb-12">
                    Vi jobber stadig med å finne ut av hvordan vi kan hjelpe jobbsøkere og arbeidsgivere med å finne
                    hverandre og ser at KI kan skape nye spennende muligheter. Dette er et første steg og vi vil
                    fortsette å utforske nye måter å gjøre det enklere for både jobbsøkere og arbeidsgivere.
                </BodyLong>

                <LinkPanel className="arb-link-panel-primary" href="/stillingsregistrering/stillingsannonser">
                    <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                        Lag ny stillingsannonse
                    </LinkPanelTitle>
                </LinkPanel>
            </div>
        </div>
    );
}
