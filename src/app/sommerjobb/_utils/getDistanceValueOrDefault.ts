import { DEFAULT_DISTANCE, DISTANCE_VALUES } from "@/app/sommerjobb/_utils/constants";

export function getDistanceValueOrDefault(distanceParam: string | undefined | null): string {
    const distance = distanceParam || DEFAULT_DISTANCE;
    return DISTANCE_VALUES.includes(distance) ? distance : DEFAULT_DISTANCE;
}
