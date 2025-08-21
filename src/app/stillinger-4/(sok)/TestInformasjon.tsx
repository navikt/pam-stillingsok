"use client";
import { BodyLong, Box, ExpansionCard, Heading, List, Link as AkselLink } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/esm/list";
import React from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TestInformasjon() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const queryString = searchParams.toString();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

    return (
        <div className="container-medium">
            <Box
                paddingInline={{ xs: "4", md: "8" }}
                paddingBlock={{ xs: "2", md: "2" }}
                maxWidth={{ lg: "800px" }}
                className="search-container"
            >
                <ExpansionCard aria-label="Informasjon til test">
                    <ExpansionCard.Header>
                        <ExpansionCard.Title>Testing av stillingssøket på arbeidsplassen.no</ExpansionCard.Title>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <BodyLong spacing>
                            Takk for at du vil hjelpe oss med å forbedre stillingssøket vårt slik at jobbsøker og
                            arbeidsgiver lettere skal finne hverandre!
                        </BodyLong>
                        <BodyLong spacing>
                            Vi har fire forskjellige versjoner, og vi ønsker å teste hvilken som gir mest relevant
                            resultat.
                        </BodyLong>
                        <List>
                            <Heading level="2" size="small">
                                Slik tester du
                            </Heading>
                            <ListItem>
                                Søk etter en stilling i søkefeltet under. Et søk kan for eksempel være
                                “logistikkmedarbeider, deltid, Rogaland”{" "}
                            </ListItem>
                            <ListItem>
                                Klikk deg gjennom de fire ulike versjonene og se hvilket treff du syntes ble mest
                                relevant. Den vil huske søket ditt når du bytter versjon.
                            </ListItem>
                            {/* eslint-disable-next-line */}
                            {typeof window !== undefined && (
                                <ListItem>
                                    Sammenlign søkeresultatene og{" "}
                                    <AkselLink
                                        target="_blank"
                                        href={`https://forms.office.com/Pages/ResponsePage.aspx?id=NGU2YsMeYkmIaZtVNSedCzzqTBH9H4JIspiNYzvKj5JUOTAzVlgxUkJQSEtPWFlYRUozWDJWQU5aRSQlQCN0PWcu&r91188d1535794ec685d89cd062e70c45=${encodeURIComponent("https://arbeidsplassen.nav.no" + fullPath)}`}
                                    >
                                        gi oss tilbakemelding
                                    </AkselLink>
                                    .
                                </ListItem>
                            )}
                        </List>
                        <BodyLong spacing>Test gjerne ut å søke etter flere jobber.</BodyLong>
                    </ExpansionCard.Content>
                </ExpansionCard>
            </Box>
        </div>
    );
}
