"use client";

import { useState } from "react";
import styles from "./AIButton.module.css";

export default function AIButton() {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <button
            type="button"
            className={`${styles["ai-tag"]} ${expanded ? styles["ai-tag-expanded"] : ""}`}
            aria-pressed={expanded}
            aria-label="AI-genererte resultater"
            onClick={() => setExpanded((prev) => !prev)}
        >
            <span className={styles["compact-label"]} aria-hidden="true">
                AI
            </span>
            <span className={styles["reveal-wrapper"]} aria-hidden="true">
                <span className={styles["label-extension"]}>-genererte resultater</span>
            </span>
        </button>
    );
}
