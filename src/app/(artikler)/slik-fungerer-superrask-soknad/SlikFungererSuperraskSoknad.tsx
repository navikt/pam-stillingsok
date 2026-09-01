import { BodyLong, Heading, LinkCard } from "@navikt/ds-react";
import { LinkCardTitle } from "@navikt/ds-react/LinkCard";
import { Stepper, StepperStep } from "@navikt/ds-react/Stepper";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

type Props = {
    readonly meta: PageInfo;
};

export default function SlikFungererSuperraskSoknad({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <Heading spacing size="xlarge" level="1">
                {meta.title}
            </Heading>
            <BodyLong size="large" spacing>
                Ny måte å motta søknader fra relevante jobbsøkere
            </BodyLong>

            <Stepper orientation="vertical" activeStep={0} className="stegindikator-container mb-12">
                <StepperStep interactive={false}>Opprett ny stillingsannonse</StepperStep>
                <StepperStep interactive={false}>Motta og vurder søknader fortløpende</StepperStep>
                <StepperStep interactive={false}>Ta kontakt med relevante jobbsøkere</StepperStep>
            </Stepper>

            <Heading size="medium" level="2" spacing>
                Velg superrask søknad i annonsen
            </Heading>
            <BodyLong spacing>
                Velg superrask søknad når dere registrerer en stillingsannonse. Spesifiser hvilke kvalifikasjoner dere
                har behov for. Legg deretter til ett eller flere spørsmål jobbsøker kan svare på.
            </BodyLong>
            <BodyLong spacing>
                Jobbsøkerne svarer på hvilke kvalifikasjoner de oppfyller, og svarer kort på spørsmålene dere har stilt.
            </BodyLong>
            <Heading size="medium" level="2" spacing>
                Motta og vurder søknadene
            </Heading>
            <BodyLong spacing>
                Dere ser raskt om en søker er aktuell, og velger selv om dere vil ta kontakt eller ikke. Dere har ikke
                inngått noen forpliktelser.
            </BodyLong>
            <Heading size="medium" level="2" spacing>
                Ta kontakt med kandidater
            </Heading>
            <BodyLong spacing>
                Hvordan ønsker dere å ta praten videre med aktuelle kandidater? Kanskje et telefonintervju eller
                kaffeprat? Dere får ikke tilsendt CV gjennom superrask søknad, så det avtaler dere eventuelt i
                etterkant.
            </BodyLong>
            <BodyLong spacing>
                Opplysningene som jobbsøkeren har gitt, slettes automatisk 3 måneder etter at fristen i
                stillingsannonsen har gått ut.{" "}
            </BodyLong>
            <LinkCard className="arb-link-panel-primary">
                <LinkCardTitle>
                    <AkselNextLinkCardAnchor href="/stillingsregistrering/stillingsannonser">
                        Lag ny stillingsannonse
                    </AkselNextLinkCardAnchor>
                </LinkCardTitle>
            </LinkCard>
        </ArticleWrapper>
    );
}
