import { BodyLong, Heading, LinkPanel } from "@navikt/ds-react";
import React from "react";
import { LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import ImageLinkPanelMedium from "@/app/(artikler)/_components/ImageLinkPanelMedium";

export default function SuperraskSoknadBedrift() {
    return (
        <article>
            <div className="container-small mt-5 mb-12">
                <Heading size="xlarge" level="1" spacing>
                    Superrask søknad – en enklere måte å komme i kontakt med relevante jobbsøkere
                </Heading>

                <BodyLong size="large" spacing>
                    Superrask søknad er en ny tjeneste på arbeidsplassen.no som vil gjøre rekrutteringen enklere for
                    bedrifter og for de som er på jakt etter ny jobb.
                </BodyLong>
            </div>

            <div className="container-medium mb-12">
                <img
                    className="article-image"
                    src="/images/bedrift.jpg"
                    alt="En mann sitter på et kontor og tar en annen i hånden"
                />
            </div>

            <div className="container-small mb-16">
                <BodyLong spacing>
                    Arbeidplassen.no er en åpen møteplass for alle på arbeidsmarkedet, eid av NAV. Vårt mål er at
                    bedrifter og jobbsøkere skal finne hverandre, enkelt og effektivt.
                </BodyLong>
                <BodyLong className="mb-12">
                    Produktleder for arbeidsplassen.no, Marianne Garmann Ullsand, er veldig fornøyd med at superrask
                    søknad er på plass. – Ved å velge superrask søknad på arbeidsplassen.no håper vi at bedrifter kan
                    spare verdifull tid når de skal ansette nye medarbeidere. Det blir også enklere for jobbsøker å vise
                    at de er interessert i jobben. Vi tror derfor at superrask søknad vil bidra til at bedriftene får
                    større og raskere respons på sine ledige stillinger, sier hun.
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Dette er superrask søknad
                </Heading>

                <Heading size="medium" level="3" spacing>
                    Velg superrask søknad i annonsen
                </Heading>
                <ul>
                    <li>
                        <BodyLong>
                            Velg superrask søknad når dere registrerer en stillingsannonse. Spesifiser hvilke
                            kvalifikasjoner dere har behov for, få med må-krav om dere har det.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong spacing>
                            Jobbsøkerne svarer på hvilke kvalifikasjoner de mener de oppfyller, og begrunner kort
                            hvorfor de er rett person for jobben.
                        </BodyLong>
                    </li>
                </ul>

                <Heading size="medium" level="3" spacing>
                    Motta og vurder søknadene
                </Heading>
                <ul>
                    <li>
                        <BodyLong>
                            Dere ser raskt om en søker er aktuell, og velger om dere vil ta kontakt eller ikke. Dere har
                            ikke inngått noen forpliktelser.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            I listen med søknader vises ikke navnene i utgangspunktet, men dere kan velge å se navnet
                            hvis dere ønsker. Det er frivillig for jobbsøker å legge inn navn.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Om dere synes at søkeren er aktuell kan dere velge å få tilgang til kontaktinformasjonen.
                            Jobbsøkeren får e-post om at dere er interessert og sannsynligvis kommer til å ta kontakt.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong spacing>
                            Dersom dere ikke synes at en jobbsøker passer for stillingen, kan dere enkelt gi beskjed om
                            dette. Søknaden vil da slettes fra listen og jobbsøkeren får automatisk et vennlig avslag på
                            sin e-post med arbeidsplassen.no som avsender.
                        </BodyLong>
                    </li>
                </ul>

                <Heading size="medium" level="3" spacing>
                    Ta kontakt med jobbsøkere
                </Heading>
                <ul>
                    <li>
                        <BodyLong spacing>
                            Hvordan ønsker dere å gå videre med aktuelle jobbsøkere? Kanskje ønsker dere et
                            telefonintervju eller en kaffeprat? Dere får ikke tilsendt CV gjennom superrask søknad, så
                            det avtaler dere eventuelt i etterkant.
                        </BodyLong>
                    </li>
                </ul>

                <BodyLong spacing>
                    Opplysningene som jobbsøkeren har gitt, slettes automatisk 3 måneder etter at fristen i
                    stillingsannonsen har gått ut.
                </BodyLong>
                <BodyLong spacing>
                    Superrask søknad er en ny løsning for bedrifter som registrerer stillinger på arbeidsplassen.no.
                    Tjenesten er under utvikling og vi vil gjerne ha tilbakemelding på hvordan den fungerer.
                </BodyLong>
                <BodyLong className="mb-12">
                    Lykke til med å finne deres neste medarbeider med superrask søknad!
                </BodyLong>

                <LinkPanel className="arb-link-panel-primary" href="/stillingsregistrering/stillingsannonser">
                    <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                        Lag ny stillingsannonse
                    </LinkPanelTitle>
                </LinkPanel>
            </div>

            <div className="container-medium mb-24">
                <Heading size="large" level="2" spacing>
                    Videre lesning
                </Heading>
                <div className="image-link-panel-grid-medium">
                    <ImageLinkPanelMedium
                        image="/images/stillingsannonse.jpg"
                        alt="Person som skriver på en skrivemaskin"
                        title="Skikkelig bra stillingsannonse"
                        description="Hva ser jobbsøkere etter når de leser en stillingsannonse? Hva bør du tenke på når
                                    du skriver annonsen?"
                        href="/skikkelig-bra-stillingsannonse"
                        color="secondary"
                    />
                    <ImageLinkPanelMedium
                        href="/enklere-a-skrive-gode-kvalifikasjoner"
                        image="/images/dog-medium.png"
                        alt="Glad hund som som sitter ved kjøkkenbordet og ser på en person som fyller ut superrask søknad."
                        title="Nå er det enklere å skrive gode kvalifikasjonskrav"
                        description="Med superrask søknad kan du nå få forslag til kvalifikasjoner ved hjelp av kunstig intelligens."
                        color="tertiary"
                    />
                </div>
            </div>
        </article>
    );
}
