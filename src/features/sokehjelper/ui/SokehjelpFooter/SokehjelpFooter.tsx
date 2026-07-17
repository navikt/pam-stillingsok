"use client";

import { MagnifyingGlassIcon } from "@navikt/aksel-icons";
import { BodyShort, HStack, Link } from "@navikt/ds-react";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";
import { buildSearchUrl } from "@/features/sokehjelper/model/buildSearchUrl";
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

        const startTime = performance.now();

        function animate(now: number): void {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
            const eased = 1 - (1 - progress) ** 3;
            const current = Math.round(from + (target! - from) * eased);

            setDisplayed(current);
            fromRef.current = current;

            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayed(target!);
                fromRef.current = target!;
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
        return "Ingen treff – prøv et annet søk";
    }
    if (count <= 10) {
        return "Noen spennende muligheter!";
    }
    if (count <= 100) {
        return "Ganske mange å velge mellom 👀";
    }
    if (count <= 500) {
        return "Oj, her var det mange muligheter!";
    }
    return "Wow, masse muligheter! 🎉";
}

type SokehjelpFooterProps = {
    readonly state: WizardState;
    version?: "v1" | "v2";
};

export default function SokehjelpFooter({ state, version = "v1" }: SokehjelpFooterProps) {
    const [count, setCount] = useState<number | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const searchUrl = buildSearchUrl(state);
    const animatedCount = useAnimatedCount(count);

    useEffect(() => {
        if (debounceRef.current !== null) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            fetchSokehjelpCount(state)
                .then(setCount)
                .catch(() => setCount(null));
        }, DEBOUNCE_MS);

        return () => {
            if (debounceRef.current !== null) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [state]);

    const quote = getQuote(count);
    const linkText = animatedCount !== null ? `Søk i ${formatNumber(animatedCount)} jobber` : "Søk i alle jobber";
    const countText = animatedCount !== null ? `${formatNumber(animatedCount)} jobber` : "Søk i alle jobber";

    return (
        <HStack as="footer" justify="space-between" align="center" gap="space-8" wrap={true} className={styles.footer}>
            {version === "v1" ? (
                <Link as={NextLink} href={searchUrl} className={styles.link} aria-label={linkText}>
                    <MagnifyingGlassIcon title={linkText} />
                    {linkText}
                </Link>
            ) : (
                <span>
                    <strong>{countText}</strong>
                </span>
            )}

            {quote !== null && (
                <BodyShort size="small" textColor="subtle" className={styles.quote} aria-live="polite">
                    {quote}
                </BodyShort>
            )}
        </HStack>
    );
}
