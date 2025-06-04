import React, { ReactElement } from "react";
import { BodyShort, Heading } from "@navikt/ds-react";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";

interface NumberOfHitsProps {
    totalAds: number;
    totalPositions?: number;
}

export default function NumberOfHits({ totalAds, totalPositions }: NumberOfHitsProps): ReactElement {
    const stillingerWord: string = totalPositions === 1 ? "stilling" : "stillinger";

    return (
        <div>
            <Heading level="2" size="small" className="white-space-nowrap" aria-live="polite">
                <span>{totalAds > 0 ? `${formatNumber(totalAds)} treff` : "Ingen treff"}</span>
            </Heading>
            <BodyShort className="white-space-nowrap">
                {totalPositions && totalAds > 0 ? `${formatNumber(totalPositions)} ${stillingerWord}` : ""}
            </BodyShort>
        </div>
    );
}
