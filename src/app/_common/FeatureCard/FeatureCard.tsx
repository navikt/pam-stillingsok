import React, { ReactNode } from "react";
import { Box, Heading, HGrid, VStack } from "@navikt/ds-react";
import styles from "./FeatureCard.module.css";
import { cn } from "@/app/_common/utils/cn";

type FeatureCardBadge =
    | Readonly<{
          type: "none";
      }>
    | Readonly<{
          type: "number";
          value: number;
      }>
    | Readonly<{
          type: "icon";
          icon: ReactNode;
      }>;

export type FeatureCardProps = Readonly<{
    title: string;
    headingLevel?: "2" | "4" | "1" | "3" | "5" | "6" | undefined;
    children: ReactNode;
    badge?: FeatureCardBadge;
    className?: string;
}>;

function FeatureCard({ title, children, badge = { type: "none" }, className, headingLevel = "2" }: FeatureCardProps) {
    const hasBadge = badge.type !== "none";
    const columns = hasBadge ? "2.5rem 1fr" : "1fr";
    return (
        <Box background="default" as="article" padding="space-24" className={cn(styles["card"], className)}>
            <HGrid columns={columns} gap="space-16" align="start">
                {hasBadge ? renderBadge(badge) : null}

                <VStack gap="space-8">
                    <Heading level={headingLevel} size="medium">
                        {title}
                    </Heading>

                    {children}
                </VStack>
            </HGrid>
        </Box>
    );
}
function renderBadge(badge: FeatureCardBadge): ReactNode {
    if (badge.type === "none") {
        return null;
    }

    if (badge.type === "number") {
        return (
            <Box as="div" className={styles["badge"]} aria-hidden="true">
                {badge.value}
            </Box>
        );
    }

    return (
        <Box as="div" className={styles["badge"]} aria-hidden>
            {badge.icon}
        </Box>
    );
}

export default FeatureCard;
