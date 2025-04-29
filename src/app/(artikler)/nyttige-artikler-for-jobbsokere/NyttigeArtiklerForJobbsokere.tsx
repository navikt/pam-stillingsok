import { Heading } from "@navikt/ds-react";
import ImageLinkPanelLarge from "@/app/_common/components/ImageLinkPanelLarge";

export default function NyttigeArtiklerForJobbsokere() {
    return (
        <div className="container-medium mt-5 mb-24">
            <div className="article-page">
                <Heading className="mb-12 text-center" size="xlarge" level="1">
                    Nyttige artikler for jobbsøkere
                </Heading>

                <div className="image-link-panel-grid-large">
                    <ImageLinkPanelLarge
                        href="/superrask-soknad-person"
                        image="/images/jobbsoker.jpg"
                        alt="En person som skriver på mobilen sin."
                        title="Superrask søknad"
                        description="En enklere måte å komme i kontakt med bedrifter."
                        color="primary"
                    />
                    <ImageLinkPanelLarge
                        href="/tips-til-jobbsoknaden"
                        image="/images/students.jpg"
                        alt="3 blide studenter som sitter med mobil og pc og snakker sammen utenfor skolen"
                        title="Tips til jobbsøknaden"
                        description="Les våre tips om hvordan skrive søknaden slik at en arbeidsgiver får lyst til å møte deg."
                        color="secondary"
                    />
                    <ImageLinkPanelLarge
                        href="jobbe-i-utlandet"
                        image="/images/paris.jpg"
                        alt="Bilde av Eiffeltårnet"
                        title="Jobbe i utlandet?"
                        description="Den Europeiske Jobbmobilitetsportalen (EURES) er et tilbud til deg som ønsker å finne en jobb i EU-/EØS-området og Sveits."
                        color="tertiary"
                    />
                    <ImageLinkPanelLarge
                        image="/images/jobbtreff.jpg"
                        alt="Bilde av person med laptop"
                        title="Enklere å finne jobber som kan passe"
                        description="Vi bruker kunstig intelligens til å plassere annonsen i den kategorien som den (mest sannsynlig) hører hjemme i."
                        href="/nye-filtre"
                        color="primary"
                    />
                </div>
            </div>
        </div>
    );
}
