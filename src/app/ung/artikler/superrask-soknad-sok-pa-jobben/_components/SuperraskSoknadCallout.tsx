import { BodyLong } from "@navikt/ds-react";
import type { ReactElement } from "react";
import IllustratedCallout from "@/app/_common/IllustratedCallout/IllustratedCallout";
import FigureThinking from "@/features/ung/ui/FigureThinking";
import styles from "./SuperraskSoknadCallout.module.css";

function SuperraskSoknadCallout(): ReactElement {
    return (
        <IllustratedCallout
            as="div"
            variant="neutral"
            illustration={<FigureThinking />}
            illustrationPosition="bottom-right"
            className={styles.callout}
            contentClassName={styles.content}
        >
            <BodyLong spacing>Er du klar for å søke?</BodyLong>

            <BodyLong>Kanskje din neste jobb bare er noen få klikk unna?</BodyLong>
        </IllustratedCallout>
    );
}

export default SuperraskSoknadCallout;
