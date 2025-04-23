import React from "react";
import NextLink from "next/link";
import { BodyLong, Heading, Link as AkselLink } from "@navikt/ds-react";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";

export default function NyeFiltre() {
    return (
        <article>
            <div className="container-small mt-5 mb-12">
                <Heading size="xlarge" level="1" spacing>
                    Nye filtre gjør det enda enklere å finne jobber som passer
                </Heading>

                <BodyLong size="large" spacing>
                    Vi ønsker å gjøre det enklere for deg å finne stillinger som kan passe. Derfor bruker vi kunstig
                    intelligens (KI) til å plassere annonsen i den kategorien som den (mest sannsynlig) hører hjemme i.
                </BodyLong>
            </div>

            <div className="container-medium mb-12">
                <img className="article-image" src="/images/jobbtreff.jpg" alt="Bilde av person med laptop" />
            </div>

            <div className="container-small mb-16">
                <BodyLong spacing>
                    Vi vet at mange synes det er vanskelig å finne stillinger som passer akkurat deres utdannelsesnivå
                    og erfaring. Spesielt de som kanskje ikke har så mye utdanning eller arbeidserfaring enda.{" "}
                </BodyLong>
                <BodyLong spacing>
                    Derfor har vi lansert noen nye filtre som går på utdanningsnivå, førerkort og nå også på erfaring.
                    Våre nye filtre er et steg på veien til enda bedre treff på jobber du kan ta, og vi ser at de har
                    blitt tatt godt i bruk.
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Slik fungerer det
                </Heading>
                <BodyLong spacing>
                    Noen annonser plasseres automatisk i riktig kategori. For våre nye kategorier &quot;førerkort&quot;,
                    &quot;utdanning&quot; og &quot;erfaring&quot; tester vi nå å bruke KI til å gjøre dette.
                </BodyLong>
                <BodyLong spacing>
                    For deg som jobbsøker betyr det at det er større sannsynlighet for at du vil finne stillingene i den
                    kategorien du forventer.
                </BodyLong>
                <BodyLong spacing>
                    Rent teknisk skjer dette ved at KI bruker avanserte algoritmer til å analysere store mengder data
                    for å identifisere nøkkelord og setninger og plasserer annonsen i den kategorien som den (mest
                    sannsynlig) hører hjemme i.
                </BodyLong>
                <BodyLong spacing>
                    Du vil antagelig oppleve at noen annonser likevel ligger i feil kategori, men vi har troen på at
                    dette skal gi deg bedre søketreff enn tidligere.{" "}
                    <AkselLink inlineText href="https://surveys.hotjar.com/8eedca7e-3fae-4852-8d96-4c9c80424cdc">
                        Ønsker du å gi oss tilbakemelding kan du gjøre det anonymt her.
                    </AkselLink>
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    KI skaper spennende muligheter
                </Heading>
                <BodyLong spacing>
                    Vi fortsetter å utforske hvordan kunstig intelligens kan brukes til å hjelpe jobbsøkere og
                    arbeidsgivere med å finne hverandre.
                </BodyLong>
                <BodyLong>
                    Tidligere lanserte vi en løsning der{" "}
                    <AkselLink as={NextLink} href="/enklere-a-skrive-gode-kvalifikasjoner" inlineText>
                        arbeidsgivere kan få forslag til kvalifikasjoner og overskrift i annonsen ved hjelp av KI.
                    </AkselLink>
                </BodyLong>
            </div>

            <div className="container-medium mb-24">
                <Heading size="large" level="2" spacing>
                    Videre lesning
                </Heading>
                <div className="image-link-panel-grid-medium">
                    <ImageLinkPanelMedium
                        image="/images/students.jpg"
                        alt="3 blide studenter som sitter med mobil og pc og snakker sammen utenfor skolen"
                        title="Tips til jobbsøknaden"
                        description="Les våre tips om hvordan skrive søknaden slik at en arbeidsgiver får lyst til å møte akkurat deg."
                        href="/tips-til-jobbsoknaden"
                        color="secondary"
                    />
                    <ImageLinkPanelMedium
                        image="/images/jobbsoker.jpg"
                        alt="En person som skriver på mobilen sin."
                        title="Superrask søknad"
                        description="En enklere måte å komme i kontakt med bedrifter."
                        href="/superrask-soknad-person"
                        color="tertiary"
                    />
                </div>
            </div>
        </article>
    );
}
