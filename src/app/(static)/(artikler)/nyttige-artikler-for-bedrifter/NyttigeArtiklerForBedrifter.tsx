import { Heading, HGrid } from "@navikt/ds-react";
import ImageLinkPanelLarge from "@/app/_common/components/ImageLinkPanelLarge";
import dogMediumImg from "@images/dog-medium.png";
import annonseImg from "@images/stillingsannonse.jpg";
import bedriftImg from "@images/bedrift.jpg";
import apiImg from "@images/api.png";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { PageBlock } from "@navikt/ds-react/Page";

type Props = {
    readonly meta: PageInfo;
};
export default function NyttigeArtiklerForBedrifter({ meta }: Props) {
    return (
        <PageBlock
            as="section"
            lang={meta.language !== "nb" ? meta.language : undefined}
            width="lg"
            aria-labelledby="nyttige-artikler-for-bedrifter-heading"
            className="mb-12 mt-5"
        >
            <Heading className="mb-12 text-center" size="xlarge" level="1" id="nyttige-artikler-for-bedrifter-heading">
                {meta.title}
            </Heading>
            <HGrid gap="space-32" columns={{ sm: 1, md: 2 }}>
                <ImageLinkPanelLarge
                    href="/enklere-a-skrive-gode-kvalifikasjoner"
                    image={dogMediumImg}
                    alt="Glad hund som som sitter ved kjøkkenbordet og ser på en person som fyller ut superrask søknad."
                    title="Nå er det enklere å skrive gode kvalifikasjonskrav"
                    description="Med superrask søknad kan du nå få forslag til kvalifikasjoner ved hjelp av kunstig intelligens."
                    color="primary"
                />
                <ImageLinkPanelLarge
                    href="/skikkelig-bra-stillingsannonse"
                    image={annonseImg}
                    alt="Person som skriver på en skrivemaskin"
                    title="Skikkelig bra stillingsannonse"
                    description="Hva ser jobbsøkere etter når de leser en stillingsannonse? Hva bør du tenke på når
                                    du skriver annonsen?"
                    color="secondary"
                />
                <ImageLinkPanelLarge
                    image={bedriftImg}
                    alt="To personer som håndhilser"
                    title="Superrask Søknad"
                    description="En enklere måte å komme i kontakt med relevante jobbsøkere."
                    href="/superrask-soknad-bedrift"
                    color="tertiary"
                />
                <ImageLinkPanelLarge
                    href="/overforing-av-stillingsannonser"
                    image={apiImg}
                    alt="API, illustrasjon"
                    title="Overføring av stillingsannonser til arbeidsplassen.no"
                    description="Navs import-API er utviklet for at det skal være enkelt å publisere stillinger på
                                    arbeidsplassen.no for våre samarbeidspartnere."
                    color="primary"
                />
            </HGrid>
        </PageBlock>
    );
}
