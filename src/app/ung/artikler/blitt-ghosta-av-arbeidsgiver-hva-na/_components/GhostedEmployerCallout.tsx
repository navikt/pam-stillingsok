import { BodyLong, BodyShort } from "@navikt/ds-react";
import { type ReactElement } from "react";
import styles from "./GhostedEmployerCallout.module.css";
import IllustratedCallout from "@/app/_common/IllustratedCallout/IllustratedCallout";
import FigureThinking from "@/features/ung/ui/FigureThinking";

function GhostedEmployerCallout(): ReactElement {
    return (
        <IllustratedCallout
            as="div"
            variant="neutral"
            illustration={<FigureThinking />}
            illustrationPosition="bottom-right"
            className={styles.callout}
        >
            <BodyLong spacing>
                Når du ikke får svar, er det lett å tenke: <i>“Jeg er ikke god nok”</i>, <i>“Jeg gjorde noe feil”</i>{" "}
                eller <i>“De likte meg ikke”.</i>
            </BodyLong>

            <BodyShort spacing>
                <strong>Men ofte handler det ikke om deg i det hele tatt.</strong>
            </BodyShort>

            <BodyLong spacing>
                Mange arbeidsgivere får veldig mange søknader og det tar tid å gå gjennom disse. Noen har ikke gode nok
                rutiner. Andre prioriterer rett og slett ikke å svare.
            </BodyLong>

            <BodyShort spacing>Det er dårlig gjort og dessverre ganske vanlig.</BodyShort>
        </IllustratedCallout>
    );
}

export default GhostedEmployerCallout;
