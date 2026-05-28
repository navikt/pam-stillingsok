import { FigureHoldingAHeart } from "@navikt/arbeidsplassen-react";
import { BodyLong, Heading, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import type React from "react";
import { NextButtonLink } from "@/app/_common/components/NextButtonLink/NextButtonLink";

export default function NoApplications(): React.JSX.Element {
    return (
        <PageBlock width="md" gutters className="mt-16 mb-16">
            <VStack align="center">
                <FigureHoldingAHeart className="mb-8" />
                <Heading level="1" size="large" className="text-center" spacing>
                    Du har ikke søkt på noen jobber ennå.
                </Heading>
                <BodyLong className="text-center" spacing>
                    Når du har søkt jobber med superrask søknad dukker de opp her. Da kan du følge med på søknadene dine
                    og trekke dem hvis du angrer deg.
                </BodyLong>
                <NextButtonLink href="/stillinger">Gå til søket</NextButtonLink>
            </VStack>
        </PageBlock>
    );
}
