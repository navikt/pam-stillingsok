import { DEFAULT_DISTANCE, DISTANCE_VALUES } from "@/app/sommerjobb/_components/constants";

export function getDistanceValueOrDefault(distanceParam: string | undefined | null): string {
    const parsedDistance = distanceParam ? Number.parseInt(distanceParam) : DEFAULT_DISTANCE;
    const distance = Number.isNaN(parsedDistance) ? DEFAULT_DISTANCE : parsedDistance;
    return DISTANCE_VALUES.includes(distance) ? distance.toString() : DEFAULT_DISTANCE.toString();
}
