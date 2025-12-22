import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import { Stepper, StepperStep } from "@navikt/ds-react/Stepper";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { PageBlock } from "@navikt/ds-react/Page";
import React from "react";

type Props = {
    readonly meta: PageInfo;
};

export default function SlikFungererSuperraskSoknad({ meta }: Props) {
    return (
        <article aria-labelledby="slik-fungerer-superrask-soknad-title" lang={meta.language}>
            <PageBlock as="section" gutters width="md" className="mb-12 mt-5">
                <Heading spacing size="xlarge" align="center" level="1" id="slik-fungerer-superrask-soknad-title">
                    {meta.title}
                </Heading>
                <BodyLong size="large" align="center" spacing>
                    Ny måte å motta søknader fra relevante jobbsøkere
                </BodyLong>

                <Stepper orientation="horizontal" activeStep={0} className="stegindikator-container mb-12">
                    <StepperStep interactive={false}>Opprett ny stillingsannonse</StepperStep>
                    <StepperStep interactive={false}>Motta og vurder søknader fortløpende</StepperStep>
                    <StepperStep interactive={false}>Ta kontakt med relevante jobbsøkere</StepperStep>
                </Stepper>
            </PageBlock>
            <PageBlock as="section" width="lg">
                <div className="guide-panel">
                    <VStack align={{ md: "center" }} className=" mb-12">
                        <Heading size="large" level="2">
                            Slik fungerer det
                        </Heading>
                    </VStack>
                    <div className="mb-8">
                        <Heading size="small" level="3" spacing>
                            Velg superrask søknad i annonsen
                        </Heading>
                        <BodyLong spacing>
                            Velg superrask søknad når dere registrerer en stillingsannonse. Spesifiser hvilke
                            kvalifikasjoner dere har behov for.
                        </BodyLong>
                        <BodyLong spacing>
                            Jobbsøkerne svarer på hvilke kvalifikasjoner de oppfyller, og begrunner kort hvorfor de er
                            rett person for jobben.
                        </BodyLong>
                        <Heading size="small" level="3" spacing>
                            Motta og vurder søknadene
                        </Heading>
                        <BodyLong spacing>
                            Dere ser raskt om en søker er aktuell, og velger selv om dere vil ta kontakt eller ikke.
                            Dere har ikke inngått noen forpliktelser.
                        </BodyLong>
                        <Heading size="small" level="3" spacing>
                            Ta kontakt med kandidater
                        </Heading>
                        <BodyLong spacing>
                            Hvordan ønsker dere å ta praten videre med aktuelle kandidater? Kanskje et telefonintervju
                            eller kaffeprat? Dere får ikke tilsendt CV gjennom superrask søknad, så det avtaler dere
                            eventuelt i etterkant.
                        </BodyLong>
                        <BodyLong>
                            Opplysningene som jobbsøkeren har gitt, slettes automatisk 3 måneder etter at fristen i
                            stillingsannonsen har gått ut.{" "}
                        </BodyLong>
                    </div>
                    <VStack align={{ xs: "start", md: "center" }}>
                        <Button variant="primary" as="a" href="/stillingsregistrering/stillingsannonser">
                            Lag ny stillingsannonse
                        </Button>
                    </VStack>
                </div>
            </PageBlock>
        </article>
    );
}
