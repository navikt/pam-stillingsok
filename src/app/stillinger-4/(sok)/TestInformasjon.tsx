"use client";
import { BodyLong, Box, ExpansionCard, Heading, List, Link as AkselLink } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/esm/list";
import React, { useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { UserPreferencesContext } from "@/app/stillinger/_common/user/UserPreferenceProvider";

export default function TestInformasjon() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { testInfo, setSearchTestKeyValue } = useContext(UserPreferencesContext);

    const open = testInfo?.testInfoCardOpen ?? true;

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
                <ExpansionCard
                    aria-label="Informasjon til test"
                    open={open}
                    onToggle={() => {
                        setSearchTestKeyValue("testInfoCardOpen", !open);
                    }}
                >
                    <ExpansionCard.Header>
                        <ExpansionCard.Title>Testing av stillingssøk på arbeidsplassen.no</ExpansionCard.Title>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <BodyLong spacing>
                            Takk for at du vil hjelpe oss med å forbedre stillingssøket vårt, slik at jobbsøker og
                            arbeidsgiver lettere skal finne hverandre!
                        </BodyLong>
                        <BodyLong spacing>
                            Vi har to ulike versjoner av søket, og trenger din hjelp med å teste hvilken som er mest
                            relevant for deg.
                        </BodyLong>
                        <List>
                            <Heading level="2" size="small">
                                Slik tester du
                            </Heading>
                            <ListItem>
                                Søk etter en stilling i søkefeltet under. Et søk kan for eksempel være
                                "logistikkmedarbeider, deltid, Rogaland"
                            </ListItem>
                            <ListItem>
                                Sammenlikne versjonene ved å veksle mellom de to resultatene og se hvilket søkeresultat
                                du syntes ble mest relevant. Søket blir husket når du bytter resultat.
                            </ListItem>
                            {/* eslint-disable-next-line */}
                            {typeof window !== undefined && (
                                <ListItem>
                                    <AkselLink
                                        target="_blank"
                                        href={`https://forms.office.com/Pages/ResponsePage.aspx?id=NGU2YsMeYkmIaZtVNSedCzzqTBH9H4JIspiNYzvKj5JUOTAzVlgxUkJQSEtPWFlYRUozWDJWQU5aRSQlQCN0PWcu&r91188d1535794ec685d89cd062e70c45=${encodeURIComponent("https://arbeidsplassen.nav.no" + fullPath)}`}
                                    >
                                        Gi oss tilbakemelding{" "}
                                    </AkselLink>
                                    når du er ferdig med å sammenlikne.
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
