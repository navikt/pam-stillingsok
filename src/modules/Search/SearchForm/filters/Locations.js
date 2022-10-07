import React from "react";
import fixLocationName from "../../../../../server/common/fixLocationName";
import {
    ADD_COUNTRY,
    ADD_COUNTY,
    ADD_MUNICIPAL,
    ADD_REMOTE,
    REMOVE_COUNTRY,
    REMOVE_COUNTY,
    REMOVE_MUNICIPAL,
    REMOVE_REMOTE,
    SET_INTERNATIONAL
} from "../../query";
import CriteriaPanel from "./CriteriaPanel";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import { Checkbox } from "@navikt/ds-react";

function Locations({ data, query, dispatch }) {
    function handleLocationClick(value, type, checked) {
        if (type === "county") {
            if (checked) {
                dispatch({ type: ADD_COUNTY, value });
            } else {
                dispatch({ type: REMOVE_COUNTY, value });
            }
        } else if (type === "municipal") {
            if (checked) {
                dispatch({ type: ADD_MUNICIPAL, value });
            } else {
                dispatch({ type: REMOVE_MUNICIPAL, value });
            }
        } else if (type === "country") {
            if (checked) {
                dispatch({ type: ADD_COUNTRY, value });
            } else {
                dispatch({ type: REMOVE_COUNTRY, value });
            }
        } else if (type === "international") {
            if (query.international) {
                query.countries.forEach((c) => {
                    dispatch({ type: REMOVE_COUNTRY, value: c });
                });
            }
            dispatch({ type: SET_INTERNATIONAL, value: !query.international });
        }
    }

    const handleZeroCountFacetClick = (countries, counties, municipals, homeOffice) => (e) => {
        const { value } = e.target;

        if (countries.includes(value)) handleLocationClick(value, "country", e.target.checked);
        else if (counties.includes(value)) handleLocationClick(value, "county", e.target.checked);
        else if (municipals.includes(value)) handleLocationClick(value, "municipal", e.target.checked);
    };

    const handleCheckboxClick = (key, type) => (e) => {
        handleLocationClick(key, type, e.target.checked);
    };

    const handleHomeOfficeClick = (e) => {
        if (e.target.checked) {
            dispatch({ type: ADD_REMOTE, value: "Hjemmekontor" });
            dispatch({ type: ADD_REMOTE, value: "Hybridkontor" });
        } else {
            dispatch({ type: REMOVE_REMOTE, value: "Hjemmekontor" });
            dispatch({ type: REMOVE_REMOTE, value: "Hybridkontor" });
        }
    };

    const unknownLocations = [
        ...new Set([...data.unknown.countries, ...data.unknown.counties, ...data.unknown.municipals])
    ];
    const checkedLocations = [...query.countries, ...query.counties, ...query.municipals];

    return (
        <CriteriaPanel panelId="locations-panel" title="Område">
            <fieldset className="CriteriaPanel__fieldset">
                <legend>Velg fylke, kommune, land eller hjemmekontor</legend>
                {data.aggregations.locations &&
                    data.aggregations.locations.map((location) => (
                        <React.Fragment key={location.key}>
                            <Checkbox
                                name="location"
                                value={location.key}
                                onChange={handleCheckboxClick(location.key, location.type)}
                                checked={
                                    query.counties.includes(location.key) ||
                                    (location.key === "UTLAND" && query.international === true)
                                }
                            >
                                {`${fixLocationName(location.key)} (${location.count})`}
                            </Checkbox>
                            {(query.counties.includes(location.key) ||
                                (location.key === "UTLAND" && query.international === true)) &&
                                location.key !== "OSLO" &&
                                location.key !== "SVALBARD" && (
                                    <fieldset className="CriteriaPanel__fieldset CriteriaPanel__fieldset--sub">
                                        <legend>Områder i {fixLocationName(location.key)}</legend>
                                        {location.subLocations &&
                                            location.subLocations.map((subLocation) => (
                                                <Checkbox
                                                    className={subLocation.count === 0 ? "Facet__zero__count" : ""}
                                                    name="location"
                                                    key={subLocation.key}
                                                    value={subLocation.key}
                                                    onChange={handleCheckboxClick(subLocation.key, subLocation.type)}
                                                    checked={
                                                        query.municipals.includes(subLocation.key) ||
                                                        query.countries.includes(subLocation.key)
                                                    }
                                                >
                                                    {`${fixLocationName(subLocation.key, true)} (${subLocation.count})`}
                                                </Checkbox>
                                            ))}
                                    </fieldset>
                                )}
                        </React.Fragment>
                    ))}

                <div className="RemoteFacet">
                    {data.aggregations.remote &&
                        data.aggregations.remote.map((remote) => (
                            <Checkbox
                                name="remote"
                                key={remote.key}
                                value={remote.key}
                                onChange={handleHomeOfficeClick}
                                checked={query.remote.includes(remote.key)}
                            >
                                {`${remote.key} (${remote.count})`}
                            </Checkbox>
                        ))}
                </div>

                <UnknownSearchCriteriaValues
                    shouldFixLocationName={true}
                    namePrefix="counties"
                    unknownValues={unknownLocations}
                    checkedValues={checkedLocations}
                    onClick={handleZeroCountFacetClick(
                        data.unknown.countries,
                        data.unknown.counties,
                        data.unknown.municipals
                    )}
                />
            </fieldset>
        </CriteriaPanel>
    );
}

export default Locations;
