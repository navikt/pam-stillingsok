import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import { WorriedFigure } from "@navikt/arbeidsplassen-react";

export default function EpostVerifiseringUtgaatt() {
    return (
        <article className="container-small mt-16 mb-16">
            <VStack align="center">
                <WorriedFigure className="mb-8" />
                <Heading spacing size="large" level="1" className="text-center">
                    Lenken er dessverre utgått
                </Heading>
                <BodyLong className="mb-8 text-center">
                    Du kan sende en ny bekreftelse inne i samtykker og innstillinger.
                </BodyLong>
                <Button variant="primary" as="a" href="/min-side/innstillinger" role="link">
                    Gå til samtykker og innstillinger
                </Button>
            </VStack>
        </article>
    );
}
