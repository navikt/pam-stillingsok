import { BodyLong, Heading, Link } from "@navikt/ds-react";
import React from "react";
import ImageLinkPanelMedium from "@/app/(artikler)/_components/ImageLinkPanelMedium";

export default function OverforingAvStillingsannonser() {
    return (
        <article>
            <div className="container-small mt-5 mb-12">
                <Heading size="xlarge" level="1" spacing>
                    Overføring av stillingsannonser til arbeidsplassen.no
                </Heading>

                <BodyLong size="large" spacing>
                    NAVs import-API er utviklet for at det skal være enkelt å publisere stillinger på arbeidsplassen.no
                    for våre samarbeidspartnere
                </BodyLong>
            </div>

            <div className="container-medium mb-12">
                <img className="article-image" src="/images/api.png" alt="API, illustrasjon" />
            </div>
            <div className="container-small mb-16">
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
                        <BodyLong>
                            Statistikk: Få kunnskap om antall visninger og antall som går videre fra annonsen på
                            arbeidsplassen.no
                        </BodyLong>
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
                    NAV har allerede samarbeid med en rekke aktører om elektronisk overføring av stillingsannonser fra
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
                    behandle data i et annet program. NAV tilbyr et API som muliggjør automatisk overføring av data fra
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
            </div>

            <div className="container-medium mb-24">
                <Heading size="large" level="2" spacing>
                    Videre lesning
                </Heading>
                <div className="image-link-panel-grid-medium">
                    <ImageLinkPanelMedium
                        image="/images/bedrift.jpg"
                        alt="En mann sitter på et kontor og tar en annen i hånden"
                        title="Superrask Søknad"
                        description="En enklere måte å komme i kontakt med relevante jobbsøkere."
                        href="/superrask-soknad-bedrift"
                        color="secondary"
                    />
                    <ImageLinkPanelMedium
                        image="/images/stillingsannonse.jpg"
                        alt="Person som skriver på en skrivemaskin"
                        title="Skikkelig bra stillingsannonse"
                        description="Hva ser jobbsøkere etter når de leser en stillingsannonse? Hva bør du tenke på når
                                    du skriver annonsen?"
                        href="/skikkelig-bra-stillingsannonse"
                        color="tertiary"
                    />
                </div>
            </div>
        </article>
    );
}
