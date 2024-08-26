import DrivingDistance from "@/app/(sok)/_components/filters/DrivingDistance";
import { ToggleGroup } from "@navikt/ds-react";
import { useState } from "react";
import Counties from "./Locations";

function DistanceOrLocation({ query, dispatch, postcodes, locations, searchResult }) {
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
