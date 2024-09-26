import DrivingDistance from "@/app/(sok)/_components/filters/DrivingDistance";
import { ToggleGroup } from "@navikt/ds-react";
import React, { ReactElement, useState, useContext } from "react";
import * as actions from "@/app/_common/actions";
import { CarIcon, LocationPinIcon } from "@navikt/aksel-icons";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";
import { UserPreferencesContext } from "@/app/_common/user/UserPreferenceProvider";
import SearchResult from "@/app/(sok)/_types/SearchResult";
import { FetchError } from "@/app/(sok)/_utils/fetchTypes";
import Counties from "./Locations";

// TODO: Fix disable no-explicit-any when new search field branch is merged
interface DistanceOrLocationProps {
    postcodes: Postcode[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    locations: any;
    searchResult: SearchResult;
    errors: FetchError[];
}

function DistanceOrLocation({ postcodes, locations, searchResult, errors }: DistanceOrLocationProps): ReactElement {
    const { locationOrDistance } = useContext(UserPreferencesContext);
    const [selectedOption, setSelectedOption] = useState(locationOrDistance || "distance");

    return (
        <>
            <ToggleGroup
                defaultValue={selectedOption}
                onChange={(val) => {
                    setSelectedOption(val);
                    actions.saveLocationOrDistance(val);
                }}
                fill
            >
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
            {selectedOption === "distance" && <DrivingDistance postcodes={postcodes} errors={errors} />}
            {selectedOption === "location" && (
                <Counties locations={locations} updatedValues={searchResult.aggregations} />
            )}
        </>
    );
}

export default DistanceOrLocation;
