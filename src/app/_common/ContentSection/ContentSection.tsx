import { Box, Heading, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import { ComponentProps, ReactNode } from "react";
import { cn } from "@/app/_common/utils/cn";
import styles from "./ContentSection.module.css";

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

type BoxProps = ComponentProps<typeof Box>;
type PageBlockProps = ComponentProps<typeof PageBlock>;
type HeadingProps = ComponentProps<typeof Heading>;

type BoxPadding = BoxProps["padding"];
type BoxAs = BoxProps["as"];
type BoxPaddingBlock = BoxProps["paddingBlock"];
type BoxPaddingInline = BoxProps["paddingInline"];
type PageBlockWidth = PageBlockProps["width"];
type HeadingLevel = HeadingProps["level"];
type HeadingSize = HeadingProps["size"];

type ContentSectionProps = Readonly<{
    ariaLabel?: string;
    as?: BoxAs;
    children: ReactNode;
    className?: string;
    heading?: string;
    headingLevel?: HeadingLevel;
    headingSize?: HeadingSize;
    padding?: BoxPadding;
    paddingBlock?: BoxPaddingBlock;
    paddingInline?: BoxPaddingInline;
    surface?: ContentSectionSurface;
    width?: PageBlockWidth;
}>;

function ContentSection(props: ContentSectionProps) {
    const {
        ariaLabel,
        as = "section",
        children,
        className,
        heading,
        headingLevel = "2",
        headingSize = "large",
        padding,
        paddingBlock,
        paddingInline,
        surface = "default",
        width = "lg",
    } = props;

    const headingId = heading != null ? `section-${heading.toLowerCase().replace(/\s+/g, "-")}` : undefined;

    if (process.env.NODE_ENV !== "production") {
        if (as === "section" && heading == null && ariaLabel == null) {
            throw new Error("ContentSection med as='section' må ha enten heading eller ariaLabel.");
        }
    }

    return (
        <Box
            as={as}
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
