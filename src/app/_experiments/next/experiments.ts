import "server-only";
import { headers } from "next/headers";
import type { ExperimentKey } from "../config";
import type { ExperimentVariant } from "../core/experiments";
import { type ExperimentAssignment, readExperimentAssignments } from "./experiments.server";

export async function getExperimentAssignments(): Promise<ExperimentAssignment[]> {
    return readExperimentAssignments(await headers());
}

export async function getExperimentVariant(key: ExperimentKey): Promise<ExperimentVariant> {
    const assignments = await getExperimentAssignments();
    return assignments.find((assignment) => assignment.key === key)?.variant ?? "standard";
}
