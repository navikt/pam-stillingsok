"use client";

import { BodyLong, Box, Heading, HStack, Link, Stack } from "@navikt/ds-react";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import { track } from "@/app/_common/umami";
import styles from "./UngOgVilJobbePromo.module.css";
import { cn } from "@/app/_common/utils/cn";
import FigureLookingRight from "@/features/ung/ui/UngOgVilJobbePromo/FigureLookingRight";
import { useInViewport } from "@/hooks/useInViewport";

export default function UngOgVilJobbePromo() {
    const { ref, isInView, hasEntered } = useInViewport<HTMLAnchorElement>({
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.5,
        once: false,
    });

    return (
        <Link
            as={Link}
            href="/ung"
            ref={ref}
            className={cn(styles["card"], "box-link full-width")}
            onClick={() => {
                track("Klikk - Forside promo ung og vil jobbe");
            }}
            data-in-view={isInView ? "true" : "false"}
            data-has-entered={hasEntered ? "true" : "false"}
        >
            <Box borderRadius="12" className={cn("full-width ung-brand-bg-1")}>
                <Stack
                    align={{ md: "start", lg: "end" }}
                    gap="space-16"
                    direction={{ xs: "column-reverse", lg: "row" }}
                >
                    <HStack
                        paddingInline={{ xs: "space-16", md: "space-24", xl: "space-32", "2xl": "space-64" }}
                        aria-hidden={true}
                    >
                        <div className={styles["face-wrap"]}>
                            <div className={styles["face-inner"]}>
                                <FigureLookingRight />
                            </div>
                        </div>
                    </HStack>

                    <Box
                        paddingBlock={{ xs: "space-24 space-0", xl: "space-40 space-0" }}
                        paddingInline="space-16"
                        maxWidth={{ xs: "100%", lg: "550px", xl: "800px", "2xl": "900px" }}
                    >
                        <Heading spacing level="2" size="large">
                            Er du ung og vil jobbe?
                        </Heading>
                        <BodyLong size="large" className="mb-4">
                            Vi lager en egen side for deg som er ung og vil ut i jobb. Her kan du sjekke ut jobber uten
                            krav til arbeidserfaring eller utdanning og gi oss innspill til nytt innhold på siden.
                        </BodyLong>
                        <ArrowRightIcon aria-hidden="true" fontSize="2rem" />
                    </Box>
                </Stack>
            </Box>
        </Link>
    );
}
