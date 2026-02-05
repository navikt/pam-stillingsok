"use client";

import { useSearchParams } from "next/navigation";

export const useIsDebug = (): boolean => {
    const searchParams = useSearchParams();
    return searchParams.get("explain") === "true";
};
