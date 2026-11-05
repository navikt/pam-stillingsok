import { Heading } from "@navikt/ds-react";
import styles from "./HeroHeading.module.css";

export const HeroHeading = () => {
    return (
        <Heading size="xlarge" level="1" className={"jumbo-h1"} align="center" spacing>
            <span className={styles.line}>
                <span className={`${styles.highlight} ${styles["highlight-blue"]}`}>Alle</span> jobber.
            </span>

            <span className={styles.line}>
                En <span className={`${styles.highlight} ${styles["highlight-green"]}`}>plass.</span>
            </span>
        </Heading>
    );
};
