import React from "react";
import { BodyLong, BodyShort } from "@navikt/ds-react";
import FigureThinking from "@/features/ung/ui/FigureThinking";
import styles from "./InfoCardWithThinkingFigure.module.css";

function InfoCardWithThinkingFigure() {
    return (
        <div className={styles["info-card-wrapper"]}>
            <div className={styles["info-card"]}>
                <BodyLong spacing>
                    Når du ikke får svar, er det lett å tenke: <i>“Jeg er ikke god nok”</i>,{" "}
                    <i>“Jeg gjorde noe feil”</i> eller <i>“De likte meg ikke”</i>
                </BodyLong>
                <BodyShort spacing>
                    <strong>Men ofte handler det ikke om deg i det hele tatt.</strong>
                </BodyShort>
                <BodyLong spacing>
                    Mange arbeidsgivere får veldig mange søknader og det tar tid å gå gjennom disse. Noen har ikke gode
                    nok rutiner. Andre prioriterer rett og slett ikke å svare.
                </BodyLong>
                <BodyShort spacing>Det er dårlig gjort og dessverre ganske vanlig.</BodyShort>
            </div>
            <FigureThinking className={styles["figure-thinking"]} />
        </div>
    );
}

export default InfoCardWithThinkingFigure;
