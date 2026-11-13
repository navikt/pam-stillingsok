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
import styles from "./ResultPending.module.css";

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
            // inert gjør innholdet inaktivt mens nye resultater hentes, slik at dimmingen ikke skjuler aktive lenker.
            inert={isPending}
            className={isPending ? `${styles.content} ${styles.pending}` : styles.content}
        >
            {children}
        </VStack>
    );
}
