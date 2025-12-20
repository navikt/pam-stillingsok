import { BodyLong, Heading, HGrid, Link } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";
import parisImg from "@images/paris.jpg";
import studentsImg from "@images/students.jpg";
import jobbsokerImg from "@images/jobbsoker.jpg";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";
import { PageBlock } from "@navikt/ds-react/Page";
import React from "react";

type Props = {
    readonly meta: PageInfo;
};

export default function JobbeIUtlandet({ meta }: Props) {
    return (
        <>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    EURES-portalen er et tilbud til deg som ønsker å finne en jobb i EU/EØS-området eller Sveits.
                </BodyLong>

                <ArticleBleedImage src={parisImg} alt="Bilde av Eiffeltårnet" />

                <Heading size="large" level="2" spacing>
                    Hva er EURES?
                </Heading>
                <BodyLong spacing>
                    EURES dekker alle EU-land, samt Island, Liechtenstein, Norge og Sveits. Portalen retter seg mot
                    personer med mobilitetsrett, og som ønsker å benytte retten til fri bevegelse.
                </BodyLong>
                <Heading size="large" level="2" spacing>
                    Hva kan jeg gjøre på EURES-portalen?
                </Heading>
                <BodyLong spacing>
                    På portalen kan du søke etter ledige stillinger. Du kan også{" "}
                    <Link href="https://eures.europa.eu/jobseekers/europass_no">opprette en Europassprofil</Link> (CV)
                    som du kan gjøre tilgjengelig for arbeidsgivere som søker nye medarbeidere.
                </BodyLong>
                <BodyLong className="mb-12">
                    Portalen kan kun benyttes av statsborgere fra EU-landene, samt Island, Liechtenstein, Norge eller
                    Sveits.
                </BodyLong>

                <LinkPanel className="arb-link-panel-primary" href="https://eures.europa.eu/index_no">
                    <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                        Gå til EURES-portalen
                    </LinkPanelTitle>
                </LinkPanel>
            </ArticleWrapper>
            <PageBlock as="section" gutters width="lg" aria-labelledby="related-articles-heading">
                <Heading size="large" level="2" id="related-articles-heading" spacing>
                    Videre lesning
                </Heading>
                <HGrid gap="space-24" columns={{ sm: 1, md: 2 }}>
                    <ImageLinkPanelMedium
                        image={studentsImg}
                        alt="3 blide studenter som sitter med mobil og pc og snakker sammen utenfor skolen"
                        title="Tips til jobbsøknaden"
                        description="Les våre tips om hvordan skrive søknaden slik at en arbeidsgiver får lyst til å møte akkurat deg."
                        href="/tips-til-jobbsoknaden"
                        color="secondary"
                    />
                    <ImageLinkPanelMedium
                        image={jobbsokerImg}
                        alt="En person som skriver på mobilen sin."
                        title="Superrask søknad"
                        description="En enklere måte å komme i kontakt med bedrifter."
                        href="/superrask-soknad-person"
                        color="tertiary"
                    />
                </HGrid>
            </PageBlock>
        </>
    );
}
