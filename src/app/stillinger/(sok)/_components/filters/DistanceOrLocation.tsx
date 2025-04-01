import DrivingDistance from "@/app/stillinger/(sok)/_components/filters/DrivingDistance";
import { ToggleGroup } from "@navikt/ds-react";
import React, { ReactElement, useState, useContext } from "react";
import * as actions from "@/app/stillinger/_common/actions";
import { CarIcon, LocationPinIcon } from "@navikt/aksel-icons";
import { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { UserPreferencesContext } from "@/app/stillinger/_common/user/UserPreferenceProvider";
import { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import Counties from "./Locations";
import { SearchLocation } from "@/app/stillinger/(sok)/page";

// TODO: Fix disable no-explicit-any when new search field branch is merged
interface DistanceOrLocationProps {
    postcodes: Postcode[];
    locations: SearchLocation[];
    searchResult: SearchResult;
    errors: FetchError[];
}

function DistanceOrLocation({ postcodes, locations, searchResult, errors }: DistanceOrLocationProps): ReactElement {
    const { locationOrDistance } = useContext(UserPreferencesContext);
    const [selectedOption, setSelectedOption] = useState(locationOrDistance || "location");

    return (
        <>
            <ToggleGroup
                aria-label="Filtrer på sted eller reisevei"
                defaultValue={selectedOption}
                onChange={(val) => {
                    setSelectedOption(val);
                    actions.saveLocationOrDistance(val);
                }}
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
