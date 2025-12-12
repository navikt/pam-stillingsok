import React from "react";
import styles from "./ReadableWidth.module.css";
import { cn } from "@/app/_common/utils/cn";

type HtmlTag = keyof React.ReactHTML;

type OwnProps = {
    readonly children: React.ReactNode;
    readonly className?: string;
};

type PropsToOmit<_Tag extends HtmlTag> = keyof OwnProps | "as";

export type TextWidthWrapperProps<_Tag extends HtmlTag> = OwnProps & { readonly as?: _Tag } & Omit<
        React.ComponentPropsWithoutRef<_Tag>,
        PropsToOmit<_Tag>
    >;

export function ReadableWidth<_Tag extends HtmlTag = "div">(props: TextWidthWrapperProps<_Tag>): React.JSX.Element {
    const { as, className, children, ...rest } = props;

    const tagName: _Tag = (as ?? "div") as _Tag;
    const mergedClassName = cn(styles.root, className);

    return React.createElement(tagName, { ...rest, className: mergedClassName }, children);
}
