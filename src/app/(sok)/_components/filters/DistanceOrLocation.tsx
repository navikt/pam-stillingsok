import DrivingDistance from "@/app/(sok)/_components/filters/DrivingDistance";
import { ToggleGroup } from "@navikt/ds-react";
import React, { ReactElement, useState } from "react";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";
import Counties from "./Locations";

// TODO: Fix disable no-explicit-any when new search field branch is merged
interface DistanceOrLocationProps {
    postcodes: Postcode[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    locations: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchResult: any;
}

function DistanceOrLocation({ postcodes, locations, searchResult }: DistanceOrLocationProps): ReactElement {
    const [selectedOption, setSelectedOption] = useState("distance");

    return (
        <>
            <ToggleGroup defaultValue={selectedOption} onChange={setSelectedOption} fill>
                <ToggleGroup.Item value="distance" label="Reisevei" />
                <ToggleGroup.Item value="location" label="Sted" />
            </ToggleGroup>
            {selectedOption === "distance" && <DrivingDistance postcodes={postcodes} />}
            {selectedOption === "location" && <Counties locations={locations} updatedValues={searchResult} />}
        </>
    );
}

export default DistanceOrLocation;
