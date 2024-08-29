import { BodyLong, Heading, Link as AkselLink, LinkPanel } from "@navikt/ds-react";
import React from "react";
import { LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import ImageLinkPanelMedium from "@/app/(artikler)/_components/ImageLinkPanelMedium";

export default function SommerjobbJobbsoker() {
    return (
        <article>
            <div className="container-small mt-5 mb-12">
                <Heading size="xlarge" level="1" spacing>
                    Sommerjobben venter på deg!
                </Heading>

                <BodyLong size="large">Nye muligheter legges ut hele tiden – søk på din neste sommerjobb nå. </BodyLong>
            </div>

            <div className="container-medium mb-12">
                <img
                    className="article-image article-image-pos"
                    src="/images/woman-portrait-gardening.jpg"
                    alt="Hagearbeider som holder to plantepotter og smiler mot kameraet."
                />
            </div>

            <div className="container-small mb-16">
                <BodyLong spacing>
                    For mange er sommerjobb det første møtet med arbeidslivet. Erfaringen du får her kan bli veldig
                    verdifull å ta med seg og ser bra ut på CV- en din.
                </BodyLong>
                <BodyLong spacing>
                    Arbeidsgivere registrerer daglig ledige stillinger på arbeidsplassen.no. I tillegg henter vi
                    automatisk inn stillinger fra mange nettsteder, og vi gir deg en samlet oversikt. Enkelt og greit!
                </BodyLong>
                <BodyLong className="mb-12">
                    <AkselLink href="/stillinger?q=sommerjobb">Her finner du sommerjobber</AkselLink>
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Tips til deg som vil søke på sommerjobber
                </Heading>
                <Heading size="medium" level="3" spacing>
                    Hvordan skille seg ut?
                </Heading>
                <BodyLong spacing>
                    Vær positiv og få frem hvorfor du er den rette for jobben. Kanskje du har vært hjelpetrener på
                    fotballaget, sittet i elevrådet eller hatt småjobber? Har du hobbyer? Kanskje det har gitt deg
                    kunnskap og ferdigheter som arbeidsgiver ser etter?{" "}
                </BodyLong>
                <BodyLong spacing>
                    Skriv gjerne om noen fag på skolen du synes er interessante eller noen kurs som du synes er morsomme
                    som kanskje kan ha relevans for jobben.
                </BodyLong>

                <Heading size="medium" level="3" spacing>
                    Superrask søknad
                </Heading>
                <BodyLong spacing>
                    På arbeidsplassen.no finner du enkelte sommerjobber som har superrask søknad. Du sender ingen CV,
                    men skriver hvorfor du mener du er rett person for jobben. Husk at du konkurrerer med andre om
                    jobbene, så det er viktig at du fremstår som positiv og motivert for jobben.
                </BodyLong>

                <Heading size="medium" level="3" spacing>
                    Bruk nettverket ditt
                </Heading>
                <BodyLong spacing>
                    Mange finner jobb gjennom nettverket sitt. Fortell at du er på jakt etter jobb. Jo flere du snakker
                    med, jo større sjanse er det for at det dukker opp jobbmuligheter.
                </BodyLong>

                <BodyLong className="mb-12">
                    Sjekk flere jobbsøkertips på{" "}
                    <AkselLink href="https://www.nav.no/soker-jobb#jobbsokertips">nav.no</AkselLink>
                </BodyLong>

                <LinkPanel className="arb-link-panel-primary" href="/stillinger?q=sommerjobb">
                    <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                        Se alle sommerjobber
                    </LinkPanelTitle>
                </LinkPanel>
            </div>

            <div className="container-medium mb-24">
                <Heading size="large" level="2" spacing>
                    Videre lesning
                </Heading>
                <div className="image-link-panel-grid-medium">
                    <ImageLinkPanelMedium
                        href="/superrask-soknad-person"
                        image="/images/jobbsoker.jpg"
                        alt="En person som skriver på mobilen sin."
                        title="Superrask søknad"
                        description="En enklere måte å komme i kontakt med bedrifter."
                        color="secondary"
                    />
                    <ImageLinkPanelMedium
                        image="/images/students.jpg"
                        alt="3 blide studenter som sitter med mobil og pc og snakker sammen utenfor skolen"
                        title="Tips til jobbsøknaden"
                        description="Les våre tips om hvordan skrive søknaden slik at en arbeidsgiver får lyst til å møte akkurat deg."
                        href="/tips-til-jobbsoknaden"
                        color="tertiary"
                    />
                </div>
            </div>
        </article>
    );
}
