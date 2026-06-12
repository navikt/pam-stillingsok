import { BodyLong } from "@navikt/ds-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import FeatureCard from "@/app/_common/FeatureCard/FeatureCard";
import { cn } from "@/app/_common/utils/cn";
import styles from "./TipsList.module.css";

type Tip = Readonly<{
    id: string;
    title: string;
    description: ReactNode;
}>;

type TipsListProps = Readonly<{
    tips: readonly Tip[];
}> &
    ComponentPropsWithoutRef<"ol">;

export default function TipsList({ tips, className, ...rest }: TipsListProps) {
    return (
        <ol className={cn(styles.list, className)} {...rest}>
            {tips.map((tip, index) => {
                return (
                    <li key={tip.id} className={styles["list-item"]}>
                        <FeatureCard title={tip.title} badge={{ type: "number", value: index + 1 }}>
                            {typeof tip.description === "string" ? (
                                <BodyLong className={styles["pre-line"]}>{tip.description}</BodyLong>
                            ) : (
                                tip.description
                            )}
                        </FeatureCard>
                    </li>
                );
            })}
        </ol>
    );
}
