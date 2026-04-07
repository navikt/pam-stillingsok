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

const TrackedAkselNextLinkCardAnchor = <Name extends EventName = EventName>(
    props: TrackedAkselNextLinkCardAnchorProps<Name>,
) => {
    const { tracking, onClick, ...rest } = props;

    const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
        if (tracking) {
            // TrackArgsFor<Name> er alltid en gyldig track()-signatur, men TS
            // klarer ikke å resolve generisk tuple-spread mot overloads.
            (track as (...args: TrackArgsFor<Name>) => void)(...tracking);
        }

        if (onClick) {
            onClick(event);
        }
    };

    return <AkselNextLinkCardAnchor {...rest} onClick={handleClick} />;
};

export default TrackedAkselNextLinkCardAnchor;
