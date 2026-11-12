"use client";

import { VStack } from "@navikt/ds-react";
import {
    createContext,
    type ReactNode,
    startTransition,
    type TransitionStartFunction,
    useContext,
    useTransition,
} from "react";

type ResultPendingContextValue = Readonly<{
    isPending: boolean;
    startTransition: TransitionStartFunction;
}>;

const ResultPendingContext = createContext<ResultPendingContextValue>({ isPending: false, startTransition });

export function ResultPendingProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [isPending, startResultTransition] = useTransition();

    return (
        <ResultPendingContext.Provider value={{ isPending, startTransition: startResultTransition }}>
            {children}
        </ResultPendingContext.Provider>
    );
}

export function useResultPending(): ResultPendingContextValue {
    return useContext(ResultPendingContext);
}

export function ResultPendingContent({ children }: Readonly<{ children: ReactNode }>) {
    const { isPending } = useResultPending();

    return (
        <VStack
            gap={{ xs: "space-24", md: "space-32" }}
            aria-busy={isPending}
            style={{ opacity: isPending ? 0.4 : 1, transition: "opacity 150ms ease-in-out" }}
        >
            {children}
        </VStack>
    );
}
