export interface LocationList {
    type: string;
    key: string;
    count: number;
    subLocations?: LocationList[];
}
