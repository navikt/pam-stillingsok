"use client";

import { useRef } from "react";

const fallbackId = (): string => {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useFlowId = (): string => {
    const idRef = useRef<string>("");

    if (idRef.current.length === 0) {
        if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
            idRef.current = crypto.randomUUID();
        } else {
            idRef.current = fallbackId();
        }
    }

    return idRef.current;
};
