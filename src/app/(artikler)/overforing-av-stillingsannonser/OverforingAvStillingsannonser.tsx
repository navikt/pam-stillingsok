import { BodyLong, Heading, HGrid, Link } from "@navikt/ds-react";
import React from "react";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";
import bedriftImg from "@images/bedrift.jpg";
import annonseImg from "@images/stillingsannonse.jpg";
import apiImg from "@images/api.png";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";
import { PageBlock } from "@navikt/ds-react/Page";

type Props = {
    readonly meta: PageInfo;
};

export default function OverforingAvStillingsannonser({ meta }: Props) {
    return (
        <>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    Navs import-API er utviklet for at det skal være enkelt å publisere stillinger på arbeidsplassen.no
                    for våre samarbeidspartnere
                </BodyLong>

                <ArticleBleedImage src={apiImg} alt="API, illustrasjon" />

                <Heading size="large" level="2" spacing>
                    Hvorfor er det bra å publisere stillinger til arbeidsplassen.no?
                </Heading>
                <ul className="mb-12">
                    <li>
                        <BodyLong>
                            Nå flest mulig relevante kandidater: Stillingssøket på arbeidsplassen.no har over 100.000
                            unike brukere hver uke
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>Gratis: Annonsering på arbeidsplassen.no er gratis for alle arbeidsgivere</BodyLong>
                    </li>
                    <li>
                        <BodyLong>Statistikk: Få kunnskap om antall sidevisninger på din annonse</BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Enkelt: Gjennom integrasjoner eller direkte på arbeidsplassen.no er det enkelt å publisere
                        </BodyLong>
                    </li>
                </ul>

                <Heading size="large" level="2" spacing>
                    Hvordan fungerer det i dag?
                </Heading>
                <BodyLong spacing>
                    Nav har allerede samarbeid med en rekke aktører om elektronisk overføring av stillingsannonser fra
                    deres nettsted til arbeidsplassen.no.
                </BodyLong>
                <BodyLong spacing>
                    Pr. måned blir over 60.000 stillinger annonsert på arbeidsplassen.no. Majoriteten av annonsene
                    kommer via elektronisk overføring fra andre nettsider-/tjenester, for eksempel fra Finn.no,
                    Webcruiter med flere. (Tall for 2022).
                </BodyLong>
                <BodyLong spacing>
                    <b>For eventuelle nye samarbeidspartnere</b> vil det tekniske forarbeidet være redusert til enkle
                    tekniske tilpasninger på deres sider for at deres annonser skal bli elektronisk overført til
                    arbeidsplassen.no. Vår tjeneste, en såkalt import API, gjør dette mulig.
                </BodyLong>
                <BodyLong className="mb-12">
                    <b>For etablerte samarbeidspartnere:</b> Arbeidsplassen.no vil også tilby etablerte
                    samarbeidspartnere å gå over fra nåværende teknologi til den nye teknologien (API-et), og vi er i en
                    tidlig dialog med flere samarbeidspartnere om dette.
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Hva er API?
                </Heading>
                <BodyLong spacing>
                    API (Application Programming Interface) er et hjelpeverktøy som gjør at to IT-systemer eller
                    dataprogrammer kan utveksle strukturert informasjon og samhandle med hverandre.
                </BodyLong>
                <BodyLong className="mb-12">
                    Gjennom dette grensesnittet kan utenforstående programmer gjøre endringer, kjøre prosesser og
                    behandle data i et annet program. Nav tilbyr et API som muliggjør automatisk overføring av data fra
                    samarbeidpartnerer sine sider for stillingsutlysninger direkte til arbeidsplassen.no
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Hva kan arbeidsgiver gjøre?
                </Heading>
                <ol type="a">
                    <li>
                        <BodyLong>
                            Først sjekke om deres leverandør allerede har et samarbeid med oss, eventuelt
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong spacing>etterspørre denne muligheten hos sin leverandør</BodyLong>
                    </li>
                </ol>

                <BodyLong>
                    Ta gjerne kontakt på e-post:{" "}
                    <Link href="mailto:nav.team.arbeidsplassen@nav.no">nav.team.arbeidsplassen@nav.no</Link> dersom dere
                    ønsker å knytte dere til vårt import-API, eller om dere har spørsmål rundt dette.
                </BodyLong>
            </ArticleWrapper>
            <PageBlock as="section" gutters width="lg" aria-labelledby="related-articles-heading">
                <Heading size="large" level="2" id="related-articles-heading" spacing>
                    Videre lesning
                </Heading>
                <HGrid gap="space-24" columns={{ sm: 1, md: 2 }}>
                    <ImageLinkPanelMedium
                        image={bedriftImg}
                        alt="To personer som håndhilser"
                        title="Superrask Søknad"
                        description="En enklere måte å komme i kontakt med relevante jobbsøkere."
                        href="/superrask-soknad-bedrift"
                        color="secondary"
                    />
                    <ImageLinkPanelMedium
                        image={annonseImg}
                        alt="Person som skriver på en skrivemaskin"
                        title="Skikkelig bra stillingsannonse"
                        description="Hva ser jobbsøkere etter når de leser en stillingsannonse? Hva bør du tenke på når
                                    du skriver annonsen?"
                        href="/skikkelig-bra-stillingsannonse"
                        color="tertiary"
                    />
                </HGrid>
            </PageBlock>
        </>
    );
}
