import DrivingDistance, { DispatchProps } from "@/app/(sok)/_components/filters/DrivingDistance";
import { ToggleGroup } from "@navikt/ds-react";
import React, { Dispatch, ReactElement, useState } from "react";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";
import Counties from "./Locations";

// TODO: Fix disable no-explicit-any when new search field branch is merged
interface DistanceOrLocationProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any;
    dispatch: Dispatch<DispatchProps>;
    postcodes: Postcode[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    locations: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchResult: any;
}

function DistanceOrLocation({
    query,
    dispatch,
    postcodes,
    locations,
    searchResult,
}: DistanceOrLocationProps): ReactElement {
    const [selectedOption, setSelectedOption] = useState("distance");

    return (
        <>
            <ToggleGroup defaultValue={selectedOption} onChange={setSelectedOption} fill>
                <ToggleGroup.Item value="distance" label="Avstand" />
                <ToggleGroup.Item value="location" label="Sted" />
            </ToggleGroup>
            {selectedOption === "distance" && (
                <DrivingDistance query={query} dispatch={dispatch} postcodes={postcodes} />
            )}
            {selectedOption === "location" && (
                <Counties query={query} dispatch={dispatch} locations={locations} updatedValues={searchResult} />
            )}
        </>
    );
}

export default DistanceOrLocation;
