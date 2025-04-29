import { Bleed, BodyLong, Box, Button, Heading, HStack } from "@navikt/ds-react";
import { List, ListItem } from "@navikt/ds-react/List";
import { BulletListIcon } from "@navikt/aksel-icons";
import ListIconWithNumber from "@/app/_common/components/ListIconWithNumber";

export default function IntroduksjonTilNySideForAnnonser() {
    return (
        <article className="container-medium mt-5 mb-24">
            <Heading spacing size="xlarge" level="1" className="text-center mb-4">
                Introduksjon til ny side for annonser
            </Heading>

            <BodyLong size="large" spacing className="text-center mb-12">
                Litt mer brukervennlig og hjelpsom – samme kjente funksjoner.
            </BodyLong>

            <img
                src="/images/introduksjon-ny-side-annonser.png"
                width="100%"
                className="mb-12"
                alt="Skjermbilde av hvordan ny annonsevisning er utformet."
                aria-describedby="introduksjon-liste"
            />

            <Box
                background="surface-alt-1-subtle"
                paddingBlock={{ xs: "6", md: "12" }}
                paddingInline={{ xs: "8", md: "24" }}
                className="mb-12 max-width-800"
            >
                <List size="medium" id="introduksjon-liste">
                    <ListItem
                        className="mb-8"
                        icon={
                            <Bleed marginBlock="0 4">
                                <ListIconWithNumber number={1} />
                            </Bleed>
                        }
                    >
                        <Heading size="small" className="mb-1">
                            Informasjon om annonsen
                        </Heading>
                        Her finner du relevant informasjon om annonsen, for eksempel når annonsen utløper eller hvilken
                        dato den blir publisert.
                    </ListItem>
                    <ListItem
                        className="mb-8"
                        icon={
                            <Bleed marginBlock="0 4">
                                <ListIconWithNumber number={2} />
                            </Bleed>
                        }
                    >
                        <Heading size="small" className="mb-1">
                            Gå til annonsen eller forhåndsvis
                        </Heading>
                        Gå til den publiserte annonsen eller til en forhåndsvisning, avhengig av status på annonsen. Du
                        har tilgang til relevante funksjoner begge steder.
                    </ListItem>
                    <ListItem
                        className="mb-8"
                        icon={
                            <Bleed marginBlock="0 4">
                                <ListIconWithNumber number={3} />
                            </Bleed>
                        }
                    >
                        <Heading size="small" className="mb-1">
                            Vis dine mottatte søknader
                        </Heading>
                        Dersom du har brukt superrask søknad, finner du alle søknader her.
                    </ListItem>
                    <ListItem
                        className="mb-8"
                        icon={
                            <Bleed marginBlock="0 4">
                                <ListIconWithNumber number={4} />
                            </Bleed>
                        }
                    >
                        <Heading size="small" className="mb-1">
                            Administrer annonsen din
                        </Heading>
                        Ønsker du å endre, kopiere, avpublisere eller slette annonsen din, finner du nå alle funksjoner
                        på ett sted.
                    </ListItem>
                    <ListItem
                        icon={
                            <Bleed marginBlock="0 4">
                                <ListIconWithNumber number={5} />
                            </Bleed>
                        }
                    >
                        <Heading size="small" className="mb-1">
                            Statuser for annonsen
                        </Heading>
                        Her finner du en tydelig visning av annonsens status, samt hvor mange superraske søknader som
                        venter på svar.
                    </ListItem>
                </List>
            </Box>
            <HStack justify="center">
                <Button
                    variant="secondary"
                    as="a"
                    href="/stillingsregistrering/stillingsannonser"
                    icon={<BulletListIcon aria-hidden="true" />}
                >
                    Tilbake til dine stillinger
                </Button>
            </HStack>
        </article>
    );
}
