import React from "react";
import PropTypes from "prop-types";
import { BodyShort, Box, Checkbox, Fieldset } from "@navikt/ds-react";
import fixLocationName from "../../../../_common/utils/fixLocationName";
import {
    ADD_COUNTRY,
    ADD_COUNTY,
    ADD_MUNICIPAL,
    ADD_REMOTE,
    REMOVE_COUNTRY,
    REMOVE_COUNTY,
    REMOVE_MUNICIPAL,
    REMOVE_REMOTE,
    SET_INTERNATIONAL,
} from "../old_query";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import buildLocations from "../utils/buildLocations";
import buildHomeOfficeValues from "../utils/buildHomeOfficeValues";
import findUnknownSearchCriteriaValues from "../utils/findUnknownSearchCriteriaValues";
import findZeroCountLocationFacets from "../utils/findZeroCountLocationFacets";
import { logSearchFilterAdded, logSearchFilterRemoved } from "../../../../_common/tracking/amplitude";

function Locations({ aggregations, locations, query, dispatch }) {
    const locationValues = buildLocations(aggregations, locations);
    const homeOfficeValues = buildHomeOfficeValues(aggregations.remote);
    const unknownCounties = findUnknownSearchCriteriaValues(query.counties, locations);
    const unknownMunicipals = findUnknownSearchCriteriaValues(query.municipals, locations, "municipals");
    const unknownCountries = findZeroCountLocationFacets(
        query.countries,
        aggregations.nationalCountMap,
        aggregations.internationalCountMap,
    );

    function handleLocationClick(value, type, checked) {
        if (type === "county") {
            if (checked) {
                logSearchFilterAdded({ sted: value });
                dispatch({ type: ADD_COUNTY, value });
            } else {
                dispatch({ type: REMOVE_COUNTY, value });
                logSearchFilterRemoved({ sted: value });
            }
        } else if (type === "municipal") {
            if (checked) {
                dispatch({ type: ADD_MUNICIPAL, value });
                logSearchFilterAdded({ sted: value });
            } else {
                dispatch({ type: REMOVE_MUNICIPAL, value });
                logSearchFilterRemoved({ sted: value });
            }
        } else if (type === "country") {
            if (checked) {
                dispatch({ type: ADD_COUNTRY, value });
                logSearchFilterAdded({ sted: value });
            } else {
                dispatch({ type: REMOVE_COUNTRY, value });
                logSearchFilterRemoved({ sted: value });
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

    const handleZeroCountFacetClick = (countries, counties, municipals) => (e) => {
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

    const unknownLocations = [...new Set([...unknownCountries, ...unknownCounties, ...unknownMunicipals])];
    const checkedLocations = [...query.countries, ...query.counties, ...query.municipals];

    return (
        <Fieldset hideLegend legend="Velg fylke, kommune, land eller hjemmekontor" className="FilterModal__fieldset">
            <div>
                {locationValues &&
                    locationValues.map((location) => {
                        // todo, trengs vel ikke om hack i searchApiTemplate.js tas vekk
                        let countyLevelHitsCount =
                            location.count - location.subLocations.reduce((sum, e) => sum + e.count, 0);
                        if (countyLevelHitsCount < 0) countyLevelHitsCount = 0;

                        return (
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
                                        {`${fixLocationName(location.key)} (${location.count})`}
                                    </span>
                                </Checkbox>
                                {(query.counties.includes(location.key) ||
                                    (location.key === "UTLAND" && query.international === true)) &&
                                    location.key !== "OSLO" &&
                                    location.key !== "SVALBARD" && (
                                        <Box paddingInline="8 0">
                                            <Fieldset hideLegend legend={`Områder i ${fixLocationName(location.key)}`}>
                                                <div>
                                                    {location.subLocations &&
                                                        location.subLocations.map((subLocation) => (
                                                            <Checkbox
                                                                name="location"
                                                                key={subLocation.key}
                                                                value={subLocation.key}
                                                                onChange={handleCheckboxClick(
                                                                    subLocation.key,
                                                                    subLocation.type,
                                                                )}
                                                                checked={
                                                                    query.municipals.includes(subLocation.key) ||
                                                                    query.countries.includes(subLocation.key)
                                                                }
                                                            >
                                                                <BodyShort
                                                                    textColor={
                                                                        subLocation.count === 0 ? "subtle" : "default"
                                                                    }
                                                                    translate="no"
                                                                >
                                                                    {`${fixLocationName(subLocation.key, true)} (${
                                                                        subLocation.count + countyLevelHitsCount
                                                                    })`}
                                                                </BodyShort>
                                                            </Checkbox>
                                                        ))}
                                                </div>
                                            </Fieldset>
                                        </Box>
                                    )}
                            </React.Fragment>
                        );
                    })}

                <div className="mt-6">
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

                <UnknownSearchCriteriaValues
                    shouldFixLocationName
                    namePrefix="counties"
                    unknownValues={unknownLocations}
                    checkedValues={checkedLocations}
                    onClick={handleZeroCountFacetClick(unknownCountries, unknownCounties, unknownMunicipals)}
                />
            </div>
        </Fieldset>
    );
}

Locations.propTypes = {
    aggregations: PropTypes.shape({
        internationalCountMap: PropTypes.object,
        nationalCountMap: PropTypes.object,
        remote: PropTypes.object,
    }),
    locations: PropTypes.arrayOf(PropTypes.object),
    query: PropTypes.shape({
        countries: PropTypes.arrayOf(PropTypes.string),
        counties: PropTypes.arrayOf(PropTypes.string),
        municipals: PropTypes.arrayOf(PropTypes.string),
        international: PropTypes.bool,
        remote: PropTypes.arrayOf(PropTypes.string),
    }),
    dispatch: PropTypes.func.isRequired,
};

export default Locations;
