import { Heading } from "@navikt/ds-react";
import ImageLinkPanelLarge from "@/app/_common/components/ImageLinkPanelLarge";
import dogMediumImg from "@images/dog-medium.png";
import annonseImg from "@images/stillingsannonse.jpg";
import bedriftImg from "@images/bedrift.jpg";
import apiImg from "@images/api.png";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";

type Props = {
    readonly meta: ArticleMeta;
};
export default function NyttigeArtiklerForBedrifter({ meta }: Props) {
    return (
        <article lang={meta.language !== "nb" ? meta.language : undefined} className="container-medium mt-5 mb-24">
            <div className="article-page">
                <Heading className="mb-12 text-center" size="xlarge" level="1">
                    {meta.title}
                </Heading>
                <div className="image-link-panel-grid-large">
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
                </div>
            </div>
        </article>
    );
}
