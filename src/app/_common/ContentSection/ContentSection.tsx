import { Box, Heading, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import { ReactNode } from "react";
import { cn } from "@/app/_common/utils/cn";
import styles from "./ContentSection.module.css";
import type { ComponentPropsWithoutRef } from "react";

const surfaceClassNames = {
    default: styles["surface-default"],
    greenSubtle: styles["surface-green-subtle"],
    purpleSubtle: styles["surface-purple-subtle"],
    peachSubtle: styles["surface-peach-subtle"],
    blueSubtle: styles["surface-blue-subtle"],
} as const;

export type ContentSectionSurface = keyof typeof surfaceClassNames;

function getSurfaceClassName(surface: ContentSectionSurface): string {
    return surfaceClassNames[surface];
}

type BoxProps = ComponentPropsWithoutRef<typeof Box>;
type BoxPadding = BoxProps["padding"];
type BoxPaddingBlock = BoxProps["paddingBlock"];
type BoxPaddingInline = BoxProps["paddingInline"];

type ContentSectionProps = Readonly<{
    children: ReactNode;
    as?: "section" | "div";
    surface?: ContentSectionSurface;
    padding?: BoxPadding;
    paddingBlock?: BoxPaddingBlock;
    paddingInline?: BoxPaddingInline;
    width?: "md" | "lg" | "xl" | "text" | "2xl" | undefined;
    className?: string;
    heading?: string;
    headingLevel?: "1" | "2" | "3" | "4" | "5" | "6" | undefined;
    headingSize?: "xsmall" | "small" | "medium" | "large" | "xlarge";
    ariaLabel?: string;
}>;

function ContentSection(props: ContentSectionProps) {
    const {
        children,
        as = "section",
        surface = "default",
        padding,
        paddingBlock,
        paddingInline,
        width = "lg",
        className,
        heading,
        headingLevel = "2",
        headingSize = "large",
        ariaLabel,
    } = props;

    const headingId = heading != null ? `section-${heading.toLowerCase().replace(/\s+/g, "-")}` : undefined;

    if (process.env.NODE_ENV !== "production") {
        if (as === "section" && heading == null && ariaLabel == null) {
            throw new Error("ContentSection med as='section' må ha enten heading eller ariaLabel.");
        }
    }

    const boxAs = as === "section" ? "section" : "div";

    return (
        <Box
            as={boxAs}
            padding={padding}
            paddingBlock={paddingBlock}
            paddingInline={paddingInline}
            className={cn(styles.section, getSurfaceClassName(surface), className)}
            aria-labelledby={headingId}
            aria-label={heading == null ? ariaLabel : undefined}
        >
            <PageBlock className={styles.inner} width={width} gutters>
                <VStack gap="space-16">
                    {heading ? (
                        <Heading
                            id={headingId}
                            level={headingLevel}
                            size={headingSize}
                            spacing
                            className={styles.heading}
                        >
                            {heading}
                        </Heading>
                    ) : null}
                    {children}
                </VStack>
            </PageBlock>
        </Box>
    );
}

export default ContentSection;
