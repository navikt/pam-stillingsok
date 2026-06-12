import { Heading } from "@navikt/ds-react";
import { cn } from "@/app/_common/utils/cn";
import styles from "./HeroHeading.module.css";

export const HeroHeading = () => {
    return (
        <Heading size="xlarge" level="1" className={cn(styles.heading, "jumbo-h1")} align="center" spacing>
            <span className={styles.line}>
                <span className={`${styles.highlight} ${styles.highlightBlue}`}>Alle</span> jobber.
            </span>

            <span className={styles.line}>
                En <span className={`${styles.highlight} ${styles.highlightGreen}`}>plass.</span>
            </span>
        </Heading>
    );
};
