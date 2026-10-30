"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect } from "react";
import { track } from "@/app/_common/umami";
import type { ExperimentConversion, ExperimentKey } from "../config";
import type { ExperimentVariant } from "../core/experiments";

export type ClientExperimentAssignment = Readonly<{
    key: string;
    variant: ExperimentVariant;
    assignmentVersion: number;
    isNew: boolean;
}>;

const ExperimentsContext = createContext<ReadonlyArray<ClientExperimentAssignment>>([]);

// Modulnivå, slik at StrictMode og remounting ikke sender samme tildeling to ganger.
const trackedAssignments = new Set<string>();

function ExposureTracker({ assignments }: Readonly<{ assignments: ReadonlyArray<ClientExperimentAssignment> }>): null {
    useEffect(() => {
        for (const { key, assignmentVersion, variant, isNew } of assignments) {
            const dedupeKey = `${key}:${assignmentVersion}:${variant}`;
            if (!isNew || trackedAssignments.has(dedupeKey)) {
                continue;
            }
            trackedAssignments.add(dedupeKey);
            track("AB - eksponering", { experiment: key, assignmentVersion, variant });
        }
    }, [assignments]);

    return null;
}

type ExperimentsProviderProps = Readonly<{
    assignments: ReadonlyArray<ClientExperimentAssignment>;
    children: ReactNode;
}>;

export function ExperimentsProvider({ assignments, children }: ExperimentsProviderProps): ReactNode {
    return (
        <ExperimentsContext.Provider value={assignments}>
            <ExposureTracker assignments={assignments} />
            {children}
        </ExperimentsContext.Provider>
    );
}

export function useExperiment(key: ExperimentKey): ExperimentVariant {
    const assignments = useContext(ExperimentsContext);
    return assignments.find((assignment) => assignment.key === key)?.variant ?? "standard";
}

/** Sender bare når brukeren har en gyldig tildeling for eksperimentet. */
export function useExperimentConversion(): (
    key: ExperimentKey,
    konvertering: ExperimentConversion,
    location?: string,
) => void {
    const assignments = useContext(ExperimentsContext);

    return useCallback(
        (key, konvertering, location) => {
            const assignment = assignments.find((candidate) => candidate.key === key);
            if (!assignment) {
                return;
            }
            track("AB - konvertering", {
                experiment: key,
                assignmentVersion: assignment.assignmentVersion,
                variant: assignment.variant,
                konvertering,
                ...(location === undefined ? {} : { location }),
            });
        },
        [assignments],
    );
}
