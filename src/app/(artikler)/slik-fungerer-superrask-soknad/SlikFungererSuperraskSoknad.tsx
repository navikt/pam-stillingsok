import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import { Stepper, StepperStep } from "@navikt/ds-react/Stepper";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";

type Props = {
    readonly meta: PageInfo;
};

export default function SlikFungererSuperraskSoknad({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} className="container-medium mb-24">
            <div className="container-small mt-5 mb-24">
                <div className="text-center">
                    <Heading spacing size="xlarge" level="1">
                        {meta.title}
                    </Heading>
                    <BodyLong size="large" spacing>
                        Ny måte å motta søknader fra relevante jobbsøkere
                    </BodyLong>
                </div>

                <div className="stegindikator-container mb-12">
                    <Stepper orientation="horizontal" activeStep={0}>
                        <StepperStep interactive={false}>Opprett ny stillingsannonse</StepperStep>
                        <StepperStep interactive={false}>Motta og vurder søknader fortløpende</StepperStep>
                        <StepperStep interactive={false}>Ta kontakt med relevante jobbsøkere</StepperStep>
                    </Stepper>
                </div>
            </div>

            <div className="guide-panel">
                <VStack align={{ md: "center" }} className=" mb-12">
                    <Heading size="large">Slik fungerer det</Heading>
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
                        Jobbsøkerne svarer på hvilke kvalifikasjoner de oppfyller, og begrunner kort hvorfor de er rett
                        person for jobben.
                    </BodyLong>
                    <Heading size="small" level="3" spacing>
                        Motta og vurder søknadene
                    </Heading>
                    <BodyLong spacing>
                        Dere ser raskt om en søker er aktuell, og velger selv om dere vil ta kontakt eller ikke. Dere
                        har ikke inngått noen forpliktelser.
                    </BodyLong>
                    <Heading size="small" level="3" spacing>
                        Ta kontakt med kandidater
                    </Heading>
                    <BodyLong spacing>
                        Hvordan ønsker dere å ta praten videre med aktuelle kandidater? Kanskje et telefonintervju eller
                        kaffeprat? Dere får ikke tilsendt CV gjennom superrask søknad, så det avtaler dere eventuelt i
                        etterkant.
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
        </ArticleWrapper>
    );
}
