"use client";
import React, { useEffect, useState } from "react";

type Props = {
    readonly message: string;
    readonly delayMs?: number;
    readonly politeness?: "polite" | "assertive";
    readonly atomic?: boolean;
};

export default function DebouncedLiveRegion({ message, delayMs = 1000, politeness = "polite", atomic = true }: Props) {
    const [announced, setAnnounced] = useState<string>("");

    useEffect(() => {
        const t = window.setTimeout(() => setAnnounced(message), delayMs);
        return () => window.clearTimeout(t);
    }, [message, delayMs]);

    return (
        <div role="status" className="visually-hidden" aria-live={politeness} aria-atomic={atomic}>
            {announced}
        </div>
    );
}
