import { BodyLong, Heading, Link as AkselLink } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";
import Image from "next/image";
import parisImg from "@images/paris.jpg";
import studentsImg from "@images/students.jpg";
import jobbsokerImg from "@images/jobbsoker.jpg";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";

type Props = {
    readonly meta: PageInfo;
};

export default function JobbeIUtlandet({ meta }: Props) {
    return (
        <article lang={meta.language === "nb" ? undefined : meta.language}>
            <div className="container-small mt-5 mb-12">
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    EURES-portalen er et tilbud til deg som ønsker å finne en jobb i EU/EØS-området eller Sveits.
                </BodyLong>
            </div>

            <div className="container-medium mb-12">
                <Image quality={90} fill className="article-image" src={parisImg} alt="Bilde av Eiffeltårnet" />
            </div>

            <div className="container-small mb-16">
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
                    <AkselLink href="https://eures.europa.eu/jobseekers/europass_no">
                        opprette en Europassprofil
                    </AkselLink>{" "}
                    (CV) som du kan gjøre tilgjengelig for arbeidsgivere som søker nye medarbeidere.
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
            </div>

            <div className="container-medium mb-24">
                <Heading size="large" level="2" spacing>
                    Videre lesning
                </Heading>
                <div className="image-link-panel-grid-medium">
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
                </div>
            </div>
        </article>
    );
}
