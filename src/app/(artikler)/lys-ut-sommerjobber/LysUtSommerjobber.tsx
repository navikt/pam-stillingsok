import { BodyLong, Heading, Link } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import React from "react";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";
import Image from "next/image";
import apiImg from "@images/api.jpg";
import bedriftImg from "@images/bedrift.jpg";
import laerlingImg from "@images/laerling-billakk.jpg";

export default function LysUtSommerjobber() {
    return (
        <article>
            <div className="container-small mt-5 mb-12">
                <Heading size="xlarge" level="1" spacing>
                    Gi ungdom en sjanse – lys ut sommerjobber
                </Heading>

                <BodyLong size="large">
                    Mange unge trenger å få arbeidserfaring. Kan du være med på å gi dem en sjanse ved å lyse ut én
                    eller flere sommerjobber i år?
                </BodyLong>
            </div>

            <div className="container-medium mb-12">
                <Image
                    className="article-image"
                    fill
                    src={laerlingImg}
                    alt="Ung person får opplæring i billakkering"
                    quality={90}
                />
            </div>

            <div className="container-small mb-16">
                <BodyLong>Her har du noen gode argumenter for hvorfor dere bør ta inn sommervikarer:</BodyLong>
                <ul className="mb-12">
                    <li>
                        <BodyLong>
                            Sommervikarene hjelper til med å holde hjulene i gang gjennom ferieavviklingen.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Sommervikarene kan ta tak i noen av de prosjektene som har blitt liggende på vent eller som
                            har blitt utsatt.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>Sommervikariat er en god rekrutteringsmulighet for videre fast ansettelse.</BodyLong>
                    </li>
                </ul>

                <BodyLong spacing>
                    Alle virksomheter med behov for ferievikarer og ekstrahjelp er velkomne til å lyse ut sine
                    stillinger på arbeidsplassen.no, Nav sin stillingsdatabase. Da får flest mulig vite om
                    jobbmulighetene. Tjenestene på arbeidsplassen.no er kostnadsfrie.
                </BodyLong>
                <BodyLong className="mb-12">
                    <Link href="/skikkelig-bra-stillingsannonse">
                        Les mer om hvordan du kan lage en treffsikker stillingsannonse.
                    </Link>
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Hvordan skal jobbsøkerne finne nettopp din sommerjobbannonse?
                </Heading>
                <BodyLong>Her følger fire tips:</BodyLong>
                <ol className="mb-12">
                    <li>
                        <BodyLong>Huk av for "feriejobb" i filter for ansettelsesform.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Vær tydelig i annonseteksten at du lyser ut sommerjobb. Skriv det gjerne i
                            annonseoverskriften.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>Vekk interesse! Bruk et språk som de unge forstår. </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Velg <Link href="/superrask-soknad-bedrift">superrask søknad</Link> som kontaktform. Det er
                            en enkel måte for unge å komme i kontakt med deg, uten CV og et langt søknadsbrev. CV kan du
                            be om senere i en samtale.
                        </BodyLong>
                    </li>
                </ol>

                <BodyLong className="mb-12">Lykke til med utlysningen!</BodyLong>

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
                        image={bedriftImg}
                        alt="En mann sitter på et kontor og tar en annen i hånden"
                        title="Superrask Søknad"
                        description="En enklere måte å komme i kontakt med relevante jobbsøkere."
                        href="/superrask-soknad-bedrift"
                        color="secondary"
                    />
                    <ImageLinkPanelMedium
                        image={apiImg}
                        alt="API, illustrasjon"
                        title="Overføring av stillingsannonser til arbeidsplassen.no"
                        description="Navs import-API er utviklet for at det skal være enkelt å publisere stillinger på
                                    arbeidsplassen.no for våre samarbeidspartnere."
                        href="/overforing-av-stillingsannonser"
                        color="tertiary"
                    />
                </div>
            </div>
        </article>
    );
}
