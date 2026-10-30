"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { ExperimentKey } from "../config";
import type { ExperimentVariant } from "../core/experiments";

export type ClientExperimentAssignment = Readonly<{
    key: string;
    variant: ExperimentVariant;
    assignmentVersion: number;
    isNew: boolean;
}>;

const ExperimentsContext = createContext<ReadonlyArray<ClientExperimentAssignment>>([]);

type ExperimentsProviderProps = Readonly<{
    assignments: ReadonlyArray<ClientExperimentAssignment>;
    children: ReactNode;
}>;

export function ExperimentsProvider({ assignments, children }: ExperimentsProviderProps): ReactNode {
    return <ExperimentsContext.Provider value={assignments}>{children}</ExperimentsContext.Provider>;
}

export function useExperiment(key: ExperimentKey): ExperimentVariant {
    const assignments = useContext(ExperimentsContext);
    return assignments.find((assignment) => assignment.key === key)?.variant ?? "standard";
}
