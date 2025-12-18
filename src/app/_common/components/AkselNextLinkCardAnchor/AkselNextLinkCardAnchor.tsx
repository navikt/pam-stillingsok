"use client";

import React from "react";
import { LinkCardAnchor, LinkCardAnchorProps } from "@navikt/ds-react/LinkCard";
import { useRouter } from "next/navigation";

function AkselNextLinkCardAnchor(props: LinkCardAnchorProps) {
    const router = useRouter();
    return (
        <LinkCardAnchor
            onClick={(event) => {
                event.preventDefault();
                if (props.href) {
                    router.push(props.href);
                }
            }}
            {...props}
        />
    );
}

export default AkselNextLinkCardAnchor;
