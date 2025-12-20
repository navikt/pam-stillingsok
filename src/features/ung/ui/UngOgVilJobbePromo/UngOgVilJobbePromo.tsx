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
            <Box borderRadius="xlarge" className={cn("full-width ung-brand-bg-1")}>
                <Stack
                    align={{ md: "start", lg: "end" }}
                    gap="space-16"
                    direction={{ xs: "column-reverse", lg: "row" }}
                >
                    <HStack paddingInline={{ xs: "4", md: "6", xl: "8", "2xl": "16" }} aria-hidden={true}>
                        <div className={styles["face-wrap"]}>
                            <div className={styles["face-inner"]}>
                                <FigureLookingRight />
                            </div>
                        </div>
                    </HStack>

                    <Box
                        paddingBlock={{ xs: "6 0", xl: "10 0" }}
                        paddingInline="4"
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
