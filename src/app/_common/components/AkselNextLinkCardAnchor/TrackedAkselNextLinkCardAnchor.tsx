"use client";

import React, { type MouseEventHandler } from "react";
import AkselNextLinkCardAnchor, { type AkselNextLinkCardAnchorProps } from "./AkselNextLinkCardAnchor";
import { type EventName, track } from "@/app/_common/umami";
import { type TrackArgsFor } from "@/app/_common/umami/events";

type TrackedAkselNextLinkCardAnchorProps<Name extends EventName = EventName> = Readonly<{
    tracking?: TrackArgsFor<Name>;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
}> &
    Omit<AkselNextLinkCardAnchorProps, "onClick">;

export default function TrackedAkselNextLinkCardAnchor(props: TrackedAkselNextLinkCardAnchorProps) {
    const { tracking, onClick, ...rest } = props;

    const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
        if (tracking) {
            track(...tracking);
        }

        if (onClick) {
            onClick(event);
        }
    };

    return <AkselNextLinkCardAnchor {...rest} onClick={handleClick} />;
}
