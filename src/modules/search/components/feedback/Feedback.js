import React from "react";
import { BodyLong, Heading, Panel, Link as AkselLink } from "@navikt/ds-react";

function Feedback() {
    return (
        <Panel className="arb-panel mt-2">
            <Heading level="2" size="medium" spacing>
                Hvordan kan vi forbedre søketjenesten for deg?
            </Heading>
            <BodyLong spacing>
                Vi setter stor pris på dine tilbakemeldinger dersom det er noe du savner eller noe du synes kunne vært
                bedre.
            </BodyLong>
            <BodyLong>
                <AkselLink href="https://surveys.hotjar.com/8eedca7e-3fae-4852-8d96-4c9c80424cdc">
                    Skriv en kort tilbakemelding
                </AkselLink>
            </BodyLong>
        </Panel>
    );
}

export default Feedback;
