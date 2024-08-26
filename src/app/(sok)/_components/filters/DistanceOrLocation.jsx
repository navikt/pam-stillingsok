import DrivingDistance from "@/app/(sok)/_components/filters/DrivingDistance";
import Counties from "./Locations";

function DistanceOrLocation({ query, dispatch, postcodes, locations, searchResult }) {
    return (
        <>
            <DrivingDistance query={query} dispatch={dispatch} postcodes={postcodes} />
            <Counties query={query} dispatch={dispatch} locations={locations} updatedValues={searchResult} />
        </>
    );
}

export default DistanceOrLocation;
