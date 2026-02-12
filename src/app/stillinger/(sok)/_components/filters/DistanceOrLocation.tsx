import DrivingDistance from "@/app/stillinger/(sok)/_components/filters/DrivingDistance";
import { ToggleGroup } from "@navikt/ds-react";
import React from "react";
import { CarIcon, LocationPinIcon } from "@navikt/aksel-icons";
import { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import Counties from "./Locations";
import { SearchLocation } from "@/app/stillinger/(sok)/page";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { useSearchParams } from "next/navigation";

// TODO: Fix disable no-explicit-any when new search field branch is merged
interface DistanceOrLocationProps {
    postcodes: Postcode[];
    locations: SearchLocation[];
    searchResult: SearchResult;
    errors: FetchError[];
}

type DistanceLocation = "location" | "distance";

/** Normaliser inngående query verdi til en gyldig union. */
const normalize = (raw: string | null | undefined): DistanceLocation => {
    return raw === "distance" ? "distance" : "location";
};

function DistanceOrLocation({ postcodes, locations, searchResult, errors }: DistanceOrLocationProps) {
    const query = useQuery();

    const searchParams = useSearchParams();

    const selectedOption: DistanceLocation = normalize(searchParams.get(QueryNames.DISTANCE_LOCATION));

    const setSelectedOption = (val: string): void => {
        query.set(QueryNames.DISTANCE_LOCATION, `${val}`);
    };
    return (
        <>
            <ToggleGroup
                aria-label="Filtrer på sted eller reisevei"
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                fill
            >
                <ToggleGroup.Item
                    value="location"
                    icon={<LocationPinIcon aria-hidden className="hide-on-md-only" />}
                    label="Sted"
                />
                <ToggleGroup.Item
                    value="distance"
                    icon={<CarIcon aria-hidden className="hide-on-md-only" />}
                    label="Reisevei"
                />
            </ToggleGroup>
            {selectedOption === "distance" && <DrivingDistance postcodes={postcodes} errors={errors} />}
            {selectedOption === "location" && (
                <Counties locations={locations} updatedValues={searchResult.aggregations} />
            )}
        </>
    );
}

export default DistanceOrLocation;
