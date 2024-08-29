import { BodyLong, Heading } from "@navikt/ds-react";
import { WavingFigure } from "@navikt/arbeidsplassen-react";

export default function Utlogget({ timeoutSearchParam }) {
    const timeoutContent =
        timeoutSearchParam && timeoutSearchParam === "true"
            ? "Av sikkerhetsgrunner har du blitt automatisk logget ut. "
            : "";

    return (
        <div className="container-small mt-5 mb-24 text-center">
            <WavingFigure className="mb-8" />
            <Heading spacing size="large" level="1">
                Du er nå logget ut
            </Heading>
            <BodyLong>{`${timeoutContent}Takk for denne gang.`}</BodyLong>
        </div>
    );
}
