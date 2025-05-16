import { BodyLong, Button, Heading } from "@navikt/ds-react";
import FigureSleeping from "@/app/_common/components/FigureSleeping";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Jobbtreff",
    robots: { index: false, follow: false },
};

export default function Page() {
    return (
        <div className="container-small mt-10 mb-24 text-center">
            <Heading size="xlarge" level="1" spacing>
                Jobbtreff
            </Heading>
            <BodyLong>
                Tjenesten ble lagt ned 13. juni 2024, fordi bruken rett og slett var for liten til å forsvare videre
                drift. Vi forstår at dette kan være skuffende, men vi er mer engasjert enn noensinne for å forbedre våre
                tilbud til deg som ser etter ny jobb.
            </BodyLong>

            <div className="mt-12 mb-6">
                <FigureSleeping />
            </div>

            <BodyLong spacing>Du finner fortsatt alle ledige stillinger i vårt stillingssøk!</BodyLong>
            <Button variant="primary" as="a" href="/stillinger">
                Søk etter din neste jobb
            </Button>
        </div>
    );
}
