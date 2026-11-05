"use client";

import { BodyShort, HStack } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";
import { fetchSokehjelpCount } from "@/features/sokehjelper/model/fetchSokehjelpCount";
import type { WizardState } from "@/features/sokehjelper/model/sokehjelperTypes";
import styles from "./SokehjelpFooter.module.css";

const DEBOUNCE_MS = 400;
const ANIMATION_DURATION_MS = 500;

function useAnimatedCount(target: number | null): number | null {
    const [displayed, setDisplayed] = useState<number | null>(target);
    const animFrameRef = useRef<number | null>(null);
    const fromRef = useRef<number | null>(target);

    useEffect(() => {
        if (target === null) {
            if (animFrameRef.current !== null) {
                cancelAnimationFrame(animFrameRef.current);
            }
            setDisplayed(null);
            fromRef.current = null;
            return;
        }

        // First value — snap immediately, no animation
        if (fromRef.current === null) {
            setDisplayed(target);
            fromRef.current = target;
            return;
        }

        const from = fromRef.current;

        if (from === target) {
            return;
        }

        const to = target;
        const startTime = performance.now();

        function animate(now: number): void {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
            const eased = 1 - (1 - progress) ** 3;
            const current = Math.round(from + (to - from) * eased);

            setDisplayed(current);
            fromRef.current = current;

            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayed(to);
                fromRef.current = to;
            }
        }

        if (animFrameRef.current !== null) {
            cancelAnimationFrame(animFrameRef.current);
        }
        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animFrameRef.current !== null) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [target]);

    return displayed;
}

function getQuote(count: number | null): string | null {
    if (count === null) {
        return null;
    }
    if (count === 0) {
        return "Ingen treff akkurat nå. Vi prøver igjen? 💙";
    }
    if (count === 1) {
        return "Det skal jo bare én til! 🎯";
    }
    if (count <= 5) {
        return "Få, men kanskje akkurat de rette? ✨";
    }
    if (count <= 10) {
        return "Her er det noen muligheter å utforske! 🌱";
    }
    if (count <= 25) {
        return "Se her, ja! Nå er vi i gang! 🙌";
    }
    if (count <= 50) {
        return "Her begynner det å bli litt å velge i! 👀";
    }
    if (count <= 100) {
        return "Nå snakker vi muligheter! ✨";
    }
    if (count <= 250) {
        return "Oi, her var det litt av hvert! 😄";
    }
    if (count <= 500) {
        return "Her var det ikke småtteri! 🚀";
    }
    if (count <= 1000) {
        return "Så mange muligheter, så mange veier videre! 🌟";
    }
    if (count <= 5000) {
        return "Her er det mye spennende å utforske! 🎉";
    }
    return "Wow, her var det mye å velge i! 🤩";
}

type SokehjelpFooterProps = {
    readonly state: WizardState;
};

export default function SokehjelpFooter({ state }: SokehjelpFooterProps) {
    const [count, setCount] = useState<number | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animatedCount = useAnimatedCount(count);

    useEffect(() => {
        if (debounceRef.current !== null) {
            clearTimeout(debounceRef.current);
        }

        let cancelled = false;
        debounceRef.current = setTimeout(() => {
            fetchSokehjelpCount(state)
                .then((result) => {
                    if (!cancelled) {
                        setCount(result);
                    }
                })
                .catch(() => {
                    if (!cancelled) {
                        setCount(null);
                    }
                });
        }, DEBOUNCE_MS);

        return () => {
            cancelled = true;
            if (debounceRef.current !== null) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [state]);

    const quote = getQuote(count);
    const countText = animatedCount !== null ? `${formatNumber(animatedCount)} jobber` : "Søk i alle jobber";

    return (
        <HStack as="footer" justify="space-between" align="center" gap="space-8" wrap={true} className={styles.footer}>
            <span>
                <strong aria-hidden="true">{countText}</strong>
                <span className="sr-only" role="status">
                    {count !== null ? `${formatNumber(count)} jobber` : "Søk i alle jobber"}
                </span>
            </span>

            {quote !== null && (
                <BodyShort size="small" textColor="subtle" className={styles.quote} aria-live="polite">
                    {quote}
                </BodyShort>
            )}
        </HStack>
    );
}
