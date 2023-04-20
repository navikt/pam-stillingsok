import React from "react";
import fixLocationName from "../../../../../../server/common/fixLocationName";
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
} from "../../../query";
import buildLocations from "../utils/buildLocations";
import buildHomeOfficeValues from "../utils/buildHomeOfficeValues";
import { Checkbox, Fieldset } from "@navikt/ds-react";

function Locations({ initialValues, query, dispatch }) {
    const locationValues = buildLocations(initialValues);
    const homeOfficeValues = buildHomeOfficeValues(initialValues.aggregations.remote);

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

    return (
        <Fieldset hideLegend legend="Velg fylke, kommune, land eller hjemmekontor" className="FilterModal__fieldset">
            {locationValues &&
                locationValues.map((location) => (
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
                            <span translate={location.key !== "UTLAND" ? "no" : undefined}>
                                {fixLocationName(location.key)}
                            </span>
                        </Checkbox>
                        {(query.counties.includes(location.key) ||
                            (location.key === "UTLAND" && query.international === true)) &&
                            location.key !== "OSLO" &&
                            location.key !== "SVALBARD" && (
                                <Fieldset
                                    hideLegend
                                    legend={`Områder i ${fixLocationName(location.key)}`}
                                    className="FilterModal__sub-fieldset FilterModal__columns-3"
                                >
                                    {location.subLocations &&
                                        location.subLocations.map((subLocation) => (
                                            <Checkbox
                                                name="location"
                                                key={subLocation.key}
                                                value={subLocation.key}
                                                onChange={handleCheckboxClick(subLocation.key, subLocation.type)}
                                                checked={
                                                    query.municipals.includes(subLocation.key) ||
                                                    query.countries.includes(subLocation.key)
                                                }
                                            >
                                                <span translate="no">{fixLocationName(subLocation.key, true)}</span>
                                            </Checkbox>
                                        ))}
                                </Fieldset>
                            )}
                    </React.Fragment>
                ))}

            <div className="mt-1_5">
                {homeOfficeValues &&
                    homeOfficeValues.map((remote) => (
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
        </Fieldset>
    );
}

export default Locations;
