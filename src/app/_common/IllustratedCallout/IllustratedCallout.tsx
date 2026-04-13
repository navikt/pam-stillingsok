import React from "react";
import { type ReactElement, type ReactNode, useId } from "react";
import styles from "./IllustratedCallout.module.css";
import { cn } from "@/app/_common/utils/cn";

type CalloutVariant = "neutral" | "info" | "highlight";
type IllustrationPosition = "bottom-right" | "bottom-left";
type ContainerElement = "div" | "section" | "aside";

type IllustratedCalloutProps = {
    readonly children: ReactNode;
    readonly title?: ReactNode;
    readonly illustration?: ReactNode;
    readonly illustrationPosition?: IllustrationPosition;
    readonly illustrationAriaLabel?: string;
    readonly variant?: CalloutVariant;
    readonly as?: ContainerElement;
    readonly className?: string;
    readonly contentClassName?: string;
    readonly illustrationClassName?: string;
};

function IllustratedCallout({
    children,
    title,
    illustration,
    illustrationPosition = "bottom-right",
    illustrationAriaLabel,
    variant = "neutral",
    as = "div",
    className,
    contentClassName,
    illustrationClassName,
}: IllustratedCalloutProps): ReactElement {
    const headingId = useId();
    const Container = as;

    return (
        <Container
            className={cn(styles.root, className)}
            data-illustration-position={illustrationPosition}
            aria-labelledby={title ? headingId : undefined}
        >
            <div className={cn(styles.content, contentClassName)} data-variant={variant}>
                {title ? (
                    <div id={headingId} className={styles.title}>
                        {title}
                    </div>
                ) : null}
                {children}
            </div>

            {illustration ? (
                <div
                    className={cn(styles.illustration, illustrationClassName)}
                    aria-hidden={illustrationAriaLabel ? undefined : true}
                    aria-label={illustrationAriaLabel}
                    role={illustrationAriaLabel ? "img" : undefined}
                >
                    {illustration}
                </div>
            ) : null}
        </Container>
    );
}

export default IllustratedCallout;
export type { IllustratedCalloutProps, CalloutVariant, IllustrationPosition };
