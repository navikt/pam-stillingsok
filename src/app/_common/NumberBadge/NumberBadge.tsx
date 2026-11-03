import { Box } from "@navikt/ds-react";
import type { ReactNode } from "react";
import { cn } from "@/app/_common/utils/cn";
import styles from "./NumberBadge.module.css";

export type NumberBadgeProps = Readonly<{
    children: ReactNode;
    className?: string;
}>;

/**
 * Rund badge med tall eller ikon, brukt for nummererte lister (f.eks. FeatureCard/TipsList)
 * og nummererte primary-accordions. Rent visuelt: `aria-hidden`, teksten ved siden av gir
 * tilgjengelig navn.
 */
function NumberBadge({ children, className }: NumberBadgeProps) {
    return (
        <Box as="span" className={cn(styles.badge, className)} aria-hidden="true">
            {children}
        </Box>
    );
}

export default NumberBadge;
