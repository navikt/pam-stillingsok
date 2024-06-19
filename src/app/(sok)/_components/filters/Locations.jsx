import React from "react";
import PropTypes from "prop-types";
import { BodyShort, Box, Checkbox, Fieldset } from "@navikt/ds-react";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import buildLocations from "@/app/(sok)/_components/utils/buildLocations";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { useSearchParams } from "next/navigation";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";
import useSearchRouter from "@/app/(sok)/_utils/useSearchRouter";

function Locations({ locations, updatedValues }) {
    const locationValues = buildLocations(updatedValues.aggregations, locations);
    const router = useSearchRouter();
    const searchParams = useSearchParams();

    function handleLocationClick(value, type, checked) {
        const newSearchParams = new URLSearchParams(searchParams);
        if (type === SearchQueryParams.COUNTY) {
            if (checked) {
                newSearchParams.append(SearchQueryParams.COUNTY, value);
            } else {
                newSearchParams.delete(SearchQueryParams.COUNTY, value);

                // Remove all checked municipals on level 2, when county is unchecked
                newSearchParams.getAll(SearchQueryParams.MUNICIPAL).forEach((obj) => {
                    if (obj.startsWith(`${value}.`)) newSearchParams.delete(SearchQueryParams.MUNICIPAL, obj);
                });
            }
            logFilterChanged({ name: "Sted", value: fixLocationName(value), checked, level: "Fylke" });
        } else if (type === SearchQueryParams.MUNICIPAL) {
            if (checked) {
                newSearchParams.append(SearchQueryParams.MUNICIPAL, value);
            } else {
                newSearchParams.delete(SearchQueryParams.MUNICIPAL, value);
            }
            logFilterChanged({ name: "Sted", value: fixLocationName(value, true), checked, level: "Kommune" });
        } else if (type === SearchQueryParams.COUNTRY) {
            if (checked) {
                newSearchParams.append(SearchQueryParams.COUNTRY, value);
            } else {
                newSearchParams.delete(SearchQueryParams.COUNTRY, value);
            }
            logFilterChanged({ name: "Sted", value: fixLocationName(value), checked, level: "Land" });
        } else if (type === SearchQueryParams.INTERNATIONAL) {
            if (checked) {
                newSearchParams.set(SearchQueryParams.INTERNATIONAL, checked);
            } else {
                newSearchParams.delete(SearchQueryParams.INTERNATIONAL);

                // Remove all checked countries when 'Utland' is unchecked
                newSearchParams.getAll(SearchQueryParams.COUNTRY).forEach((c) => {
                    newSearchParams.delete(SearchQueryParams.COUNTRY, c);
                });
            }
        }
        router.replace(newSearchParams, { scroll: false });
    }

    const handleCheckboxClick = (key, type) => (e) => {
        handleLocationClick(key, type, e.target.checked);
    };

    return (
        <Fieldset
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">sted</span>
                </>
            }
            className="FilterModal__fieldset"
        >
            <div>
                {locationValues &&
                    locationValues.map((location) => (
                        <React.Fragment key={location.key}>
                            {location.key === "UTLAND" ? (
                                <Checkbox
                                    name={SearchQueryParams.INTERNATIONAL}
                                    value="true"
                                    onChange={handleCheckboxClick(location.key, location.type)}
                                    checked={searchParams.get(SearchQueryParams.INTERNATIONAL) === "true"}
                                >
                                    Utland ({updatedValues.aggregations.totalInternational})
                                </Checkbox>
                            ) : (
                                <Checkbox
                                    name={SearchQueryParams.COUNTY}
                                    value={location.key}
                                    onChange={handleCheckboxClick(location.key, location.type)}
                                    checked={searchParams.getAll(SearchQueryParams.COUNTY).includes(location.key)}
                                >
                                    <span translate="no">{`${fixLocationName(location.key)} (${location.count})`}</span>
                                </Checkbox>
                            )}

                            {(searchParams.getAll(SearchQueryParams.COUNTY).includes(location.key) ||
                                (location.key === "UTLAND" &&
                                    searchParams.get(SearchQueryParams.INTERNATIONAL) === "true")) &&
                                location.key !== "OSLO" &&
                                location.key !== "SVALBARD" && (
                                    <Box paddingInline="8 0">
                                        <Fieldset hideLegend legend={`Områder i ${fixLocationName(location.key)}`}>
                                            <div>
                                                {location.subLocations &&
                                                    location.subLocations.map((subLocation) => (
                                                        <Checkbox
                                                            name={
                                                                location.key === "UTLAND"
                                                                    ? SearchQueryParams.COUNTRY
                                                                    : SearchQueryParams.MUNICIPAL
                                                            }
                                                            key={subLocation.key}
                                                            value={subLocation.key}
                                                            onChange={handleCheckboxClick(
                                                                subLocation.key,
                                                                subLocation.type,
                                                            )}
                                                            checked={
                                                                searchParams
                                                                    .getAll(SearchQueryParams.MUNICIPAL)
                                                                    .includes(subLocation.key) ||
                                                                searchParams
                                                                    .getAll(SearchQueryParams.COUNTRY)
                                                                    .includes(subLocation.key)
                                                            }
                                                        >
                                                            <BodyShort
                                                                textColor={
                                                                    subLocation.count === 0 ? "subtle" : "default"
                                                                }
                                                                translate="no"
                                                            >
                                                                {`${fixLocationName(subLocation.key, true)} (${
                                                                    subLocation.count
                                                                })`}
                                                            </BodyShort>
                                                        </Checkbox>
                                                    ))}
                                            </div>
                                        </Fieldset>
                                    </Box>
                                )}
                        </React.Fragment>
                    ))}
            </div>
        </Fieldset>
    );
}

Locations.propTypes = {
    updatedValues: PropTypes.shape({
        aggregations: PropTypes.shape({
            internationalCountMap: PropTypes.object,
            nationalCountMap: PropTypes.object,
        }),
    }),
    locations: PropTypes.arrayOf(PropTypes.object),
};

export default Locations;
