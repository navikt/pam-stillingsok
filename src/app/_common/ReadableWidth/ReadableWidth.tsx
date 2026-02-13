import React from "react";
import styles from "./ReadableWidth.module.css";
import { cn } from "@/app/_common/utils/cn";

type HtmlTag = Extract<keyof React.JSX.IntrinsicElements, string>;

type OwnProps = {
    readonly children: React.ReactNode;
    readonly className?: string;
};

type PropsToOmit<_Tag extends HtmlTag> = keyof OwnProps | "as";

export type ReadableWidthProps<Tag extends HtmlTag = "div"> = OwnProps & { readonly as?: Tag } & Omit<
        React.ComponentPropsWithoutRef<Tag>,
        PropsToOmit<Tag>
    >;

export function ReadableWidth<Tag extends HtmlTag = "div">(props: ReadableWidthProps<Tag>): React.JSX.Element {
    const { as, className, children, ...rest } = props;

    const tagName: Tag = (as ?? "div") as Tag;
    const mergedClassName = cn(styles.root, className);

    return React.createElement(tagName, { ...rest, className: mergedClassName }, children);
}
