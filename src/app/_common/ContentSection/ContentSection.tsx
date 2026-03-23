import { Box, Heading } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import { type AkselSpaceToken } from "@navikt/ds-tokens/types";
import { ReactNode } from "react";
import { cn } from "@/app/_common/utils/cn";
import styles from "./ContentSection.module.css";

const surfaceClassNames = {
    default: styles["surface-default"],
    greenSubtle: styles["surface-green-subtle"],
    purpleSubtle: styles["surface-purple-subtle"],
    peachSubtle: styles["surface-peach-subtle"],
} as const;

export type ContentSectionSurface = keyof typeof surfaceClassNames;

function getSurfaceClassName(surface: ContentSectionSurface): string {
    return surfaceClassNames[surface];
}

type ContentSectionProps = Readonly<{
    children: ReactNode;
    as?: "section" | "div";
    surface?: ContentSectionSurface;
    padding?: AkselSpaceToken | undefined;
    width?: "md" | "lg" | "xl" | "text" | "2xl" | undefined;
    className?: string;
    heading?: string;
    headingLevel?: "1" | "2" | "3" | "4" | "5" | "6" | undefined;
    headingSize?: "xsmall" | "small" | "medium" | "large" | "xlarge";
    sectionId?: string;
    ariaLabel?: string;
}>;

function ContentSection(props: ContentSectionProps) {
    const {
        children,
        as = "section",
        surface = "default",
        padding = "space-40",
        width = "lg",
        className,
        heading,
        headingLevel = "2",
        headingSize = "medium",
        sectionId,
        ariaLabel,
    } = props;

    const outerClassName = cn(styles.section, getSurfaceClassName(surface), className);

    const headingId =
        heading && sectionId == null ? `section-${heading.toLowerCase().replace(/\s+/g, "-")}` : sectionId;

    if (process.env.NODE_ENV !== "production") {
        if (as === "section" && heading == null && ariaLabel == null) {
            throw new Error("ContentSection med as='section' må ha enten heading or ariaLabel.");
        }
    }

    const boxAs = as === "section" ? "section" : "div";

    return (
        <Box
            as={boxAs}
            padding={padding}
            className={outerClassName}
            aria-labelledby={headingId}
            aria-label={heading == null ? ariaLabel : undefined}
        >
            <PageBlock className={styles.inner} width={width}>
                {heading ? (
                    <Heading id={headingId} level={headingLevel} size={headingSize} className={styles.heading}>
                        {heading}
                    </Heading>
                ) : null}
                {children}
            </PageBlock>
        </Box>
    );
}

export default ContentSection;
