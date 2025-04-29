import { BodyLong, Heading } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import React from "react";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";

export default function SuperraskSoknadBedrift() {
    return (
        <article>
            <div className="container-small mt-5 mb-12">
                <Heading size="xlarge" level="1" spacing>
                    Nye funksjoner i Superrask søknad – Det er nå enda enklere å følge opp og sortere søknadene du har
                    mottatt
                </Heading>

                <BodyLong size="large" spacing>
                    Superrask søknad er en tjeneste på arbeidsplassen.no som vil gjøre rekrutteringen enklere for
                    bedrifter og for de som er på jakt etter ny jobb.
                </BodyLong>
            </div>

            <div className="container-medium mb-12">
                <img className="article-image" src="/images/bedrift.jpg" alt="To personer som håndhilser" />
            </div>

            <div className="container-small mb-16">
                <BodyLong spacing>
                    Produktleder for arbeidsplassen.no, Marianne Garmann Ullsand, er veldig fornøyd med at superrask
                    søknad er så godt mottatt. – Vi ser at mange bedrifter og jobbsøkere har tatt i bruk superrask
                    søknad på arbeidsplassen.no. Bedrifter setter pris på at den er enkel å opprette og at den bidrar
                    til at de får større og raskere respons på sine ledige stillinger. Jobbsøkerne liker at de enklere
                    og raskere kan vise at de er interessert i jobben uten CV og skrive lang søknad.
                </BodyLong>
                <Heading size="medium" level="2" spacing>
                    Ny og forbedret versjon
                </Heading>
                <BodyLong className="mb-12">
                    Arbeidsgivere har savnet å kunne sette flere statuser på kandidaten under rekrutteringsprosessen.
                    Dette, samt flere andre forbedringer og forenklinger, er nå tilgjengelig i den oppdaterte versjonen
                    av superrask søknad sier hun.
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
                            Velg superrask søknad når dere registrerer eller endrer en stillingsannonse på
                            arbeidsplassen.no. Spesifiser hvilke kvalifikasjoner dere har behov for, få med må-krav om
                            dere har det.
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
                            Dere finner søknadene under Stillingsannonser og Vis søknader på den aktuelle stillingen.
                            Navnene på søkerne vises ikke i utgangspunktet, da det er frivilling å legge inn navn. Dere
                            kan velge å vise navn.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Dere ser raskt om en søker er aktuell, og velger om dere vil ta kontakt eller ikke.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Om dere synes at søkeren er aktuell, kan dere velge å få tilgang til kontaktinformasjonen.
                            Jobbsøkeren får e-post om at dere er interessert og sannsynligvis kommer til å ta kontakt.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong> Dere kan endre status på kandidaten underveis i prosessen.</BodyLong>
                    </li>
                    <li>
                        <BodyLong spacing>
                            Ønsker dere ikke å gå videre med kandidaten, kan dere enkelt gi beskjed om dette. Søknaden
                            vil da slettes fra listen og jobbsøkeren får automatisk et vennlig avslag på sin e-post med
                            arbeidsplassen.no som avsender.
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

                <Heading size="medium" level="3" spacing>
                    Fikk du ansatt?
                </Heading>
                <ul>
                    <li>
                        <BodyLong spacing>
                            Da markerer du stillingen som besatt og annonsen blir avpublisert på arbeidsplassen.no. Vi
                            sender melding til alle kandidater som ikke har status «ansatt».
                        </BodyLong>
                    </li>
                </ul>

                <BodyLong spacing>
                    Opplysningene som jobbsøkeren har gitt, slettes automatisk 3 måneder etter at fristen i
                    stillingsannonsen har gått ut.
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
