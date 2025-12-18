"use client";

import React from "react";
import { LinkCardAnchor, LinkCardAnchorProps } from "@navikt/ds-react/LinkCard";
import Link from "next/link";

function AkselNextLinkCardAnchor(props: LinkCardAnchorProps) {
    const { href, children, ...rest } = props;
    if (!href) {
        throw new Error("AkselNextLinkCardAnchor requires a href prop");
    }
    return (
        <LinkCardAnchor asChild>
            <Link href={href} {...rest}>
                {children}
            </Link>
        </LinkCardAnchor>
    );
}

export default AkselNextLinkCardAnchor;
