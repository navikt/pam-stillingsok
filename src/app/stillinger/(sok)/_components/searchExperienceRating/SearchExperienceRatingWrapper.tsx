"use client";

import type React from "react";
import { useRef } from "react";
import { SearchExperienceRating } from "./SearchExperienceRating";

type SearchExperienceRatingWrapperProps = {
    readonly children: React.ReactNode;
};

export function SearchExperienceRatingWrapper({ children }: SearchExperienceRatingWrapperProps) {
    const searchBoxRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div ref={searchBoxRef}>{children}</div>
            <SearchExperienceRating searchBoxRef={searchBoxRef} />
        </>
    );
}
