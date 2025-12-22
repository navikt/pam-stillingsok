import { Heading, HGrid } from "@navikt/ds-react";
import ImageLinkPanelLarge from "@/app/_common/components/ImageLinkPanelLarge";
import jobbsokerImg from "@images/jobbsoker.jpg";
import studentsImg from "@images/students.jpg";
import parisImg from "@images/paris.jpg";
import jobbtreffImg from "@images/jobbtreff.jpg";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { PageBlock } from "@navikt/ds-react/Page";

type Props = {
    readonly meta: PageInfo;
};

export default function NyttigeArtiklerForJobbsokere({ meta }: Props) {
    return (
        <PageBlock
            as="section"
            lang={meta.language !== "nb" ? meta.language : undefined}
            width="lg"
            aria-labelledby="nyttige-artikler-for-jobbsokere"
            className="mb-12 mt-5"
        >
            <div className="article-page">
                <Heading className="mb-12 text-center" size="xlarge" level="1" id="nyttige-artikler-for-jobbsokere">
                    {meta.title}
                </Heading>

                <HGrid gap="space-32" columns={{ sm: 1, md: 2 }}>
                    <ImageLinkPanelLarge
                        href="/superrask-soknad-person"
                        image={jobbsokerImg}
                        alt="En person som skriver på mobilen sin."
                        title="Superrask søknad"
                        description="En enklere måte å komme i kontakt med bedrifter."
                        color="primary"
                    />
                    <ImageLinkPanelLarge
                        href="/tips-til-jobbsoknaden"
                        image={studentsImg}
                        alt="3 blide studenter som sitter med mobil og pc og snakker sammen utenfor skolen"
                        title="Tips til jobbsøknaden"
                        description="Les våre tips om hvordan skrive søknaden slik at en arbeidsgiver får lyst til å møte deg."
                        color="secondary"
                    />
                    <ImageLinkPanelLarge
                        href="jobbe-i-utlandet"
                        image={parisImg}
                        alt="Bilde av Eiffeltårnet"
                        title="Jobbe i utlandet?"
                        description="Den Europeiske Jobbmobilitetsportalen (EURES) er et tilbud til deg som ønsker å finne en jobb i EU-/EØS-området og Sveits."
                        color="tertiary"
                    />
                    <ImageLinkPanelLarge
                        image={jobbtreffImg}
                        alt="Bilde av person med laptop"
                        title="Enklere å finne jobber som kan passe"
                        description="Vi bruker kunstig intelligens til å plassere annonsen i den kategorien som den (mest sannsynlig) hører hjemme i."
                        href="/nye-filtre"
                        color="primary"
                    />
                </HGrid>
            </div>
        </PageBlock>
    );
}
