export type LocationList = Readonly<{
    type: string;
    key: string;
    count: number;
    subLocations?: readonly LocationList[];
}>;
export type MutableLocationList = {
    type: string;
    key: string;
    count: number;
    subLocations?: MutableLocationList[];
};
