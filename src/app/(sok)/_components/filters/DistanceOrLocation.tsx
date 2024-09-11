import DrivingDistance from "@/app/(sok)/_components/filters/DrivingDistance";
import { ToggleGroup } from "@navikt/ds-react";
import { CarIcon, LocationPinIcon } from "@navikt/aksel-icons";
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
                <ToggleGroup.Item
                    value="distance"
                    icon={<CarIcon aria-hidden className="hide-on-md-only" />}
                    label="Reisevei"
                />
                <ToggleGroup.Item
                    value="location"
                    icon={<LocationPinIcon aria-hidden className="hide-on-md-only" />}
                    label="Sted"
                />
            </ToggleGroup>
            {selectedOption === "distance" && <DrivingDistance postcodes={postcodes} />}
            {selectedOption === "location" && <Counties locations={locations} updatedValues={searchResult} />}
        </>
    );
}

export default DistanceOrLocation;
