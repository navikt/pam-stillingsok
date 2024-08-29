import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import { CelebratingFigure } from "@navikt/arbeidsplassen-react";

export default function VerifisertEpost() {
    return (
        <article className="container-small mt-16 mb-16">
            <VStack align="center">
                <CelebratingFigure className="mb-8" />
                <Heading spacing size="large" level="1" className="text-center">
                    E-postadressen din er bekreftet
                </Heading>
                <BodyLong className="mb-8 text-center">
                    Du vil nå kunne motta e-postvarsler på dine lagrede søk.
                </BodyLong>
                <Button variant="primary" as="a" href="/stillinger" role="link">
                    Gå til ledige stillinger
                </Button>
            </VStack>
        </article>
    );
}
