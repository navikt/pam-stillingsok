import React, { ReactElement } from "react";
import { BodyShort, Box, Checkbox, Fieldset } from "@navikt/ds-react";
import fixLocationName from "@/app/stillinger/_common/utils/fixLocationName";
import buildLocations from "@/app/stillinger/(sok)/_components/utils/buildLocations";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { SearchLocation } from "@/app/stillinger/(sok)/page";
import { LocationList } from "@/app/stillinger/(sok)/_components/searchBox/buildSearchBoxOptions";

interface SubLocation {
    type: string;
    key: string;
    count: number;
}

export type Location = {
    type: string;
    key: string;
    count: number;
    subLocations: SubLocation[];
};

interface LocationsProps {
    locations: SearchLocation[];
    updatedValues: FilterAggregations;
}
export default function Locations({ locations, updatedValues }: LocationsProps): ReactElement {
    const locationValues: LocationList[] = buildLocations(updatedValues, locations);
    const query = useQuery();

    function handleLocationClick(value: string, type: string, checked: boolean): void {
        if (type === "county") {
            if (checked) {
                query.append(QueryNames.COUNTY, value);
            } else {
                query.remove(QueryNames.COUNTY, value);
            }
            query.getAll(QueryNames.MUNICIPAL).forEach((obj) => {
                if (obj.startsWith(`${value}.`)) {
                    query.remove(QueryNames.MUNICIPAL, obj);
                }
            });
        } else if (type === "municipal") {
            if (checked) {
                query.append(QueryNames.MUNICIPAL, value);
            } else {
                query.remove(QueryNames.MUNICIPAL, value);
            }
        } else if (type === "country") {
            if (checked) {
                query.append(QueryNames.COUNTRY, value);
            } else {
                query.remove(QueryNames.COUNTRY, value);
            }
        } else if (type === "international") {
            if (checked) {
                query.set(QueryNames.INTERNATIONAL, "true");
            } else {
                query.remove(QueryNames.INTERNATIONAL);
                query.remove(QueryNames.COUNTRY);
            }
        }
    }

    const handleCheckboxClick =
        (key: string, type: string) =>
        (e: React.ChangeEvent<HTMLInputElement>): void => {
            handleLocationClick(key, type, e.target.checked);
        };

    return (
        <Fieldset
            legend={
                <BodyShort as="span" visuallyHidden>
                    Filtrer etter sted
                </BodyShort>
            }
            className="FilterModal__fieldset mt-4"
        >
            <div>
                {locationValues &&
                    locationValues.map((location) => (
                        <React.Fragment key={location.key}>
                            {location.key === "UTLAND" ? (
                                <Checkbox
                                    name="international"
                                    value="true"
                                    onChange={handleCheckboxClick(location.key, location.type)}
                                    checked={query.get(QueryNames.INTERNATIONAL) === "true"}
                                >
                                    Utland ({updatedValues.totalInternational})
                                </Checkbox>
                            ) : (
                                <Checkbox
                                    name="counties[]"
                                    value={location.key}
                                    onChange={handleCheckboxClick(location.key, location.type)}
                                    checked={query.getAll(QueryNames.COUNTY).includes(location.key)}
                                >
                                    <span translate="no">{`${fixLocationName(location.key)} (${location.count})`}</span>
                                </Checkbox>
                            )}

                            {(query.getAll(QueryNames.COUNTY).includes(location.key) ||
                                (location.key === "UTLAND" && query.get(QueryNames.INTERNATIONAL) === "true")) &&
                                location.key !== "OSLO" &&
                                location.key !== "SVALBARD" && (
                                    <Box paddingInline="8 0">
                                        <Fieldset hideLegend legend={`Områder i ${fixLocationName(location.key)}`}>
                                            <div>
                                                {location.subLocations &&
                                                    location.subLocations
                                                        .sort((a, b) => a.key.localeCompare(b.key, "no"))
                                                        .map((subLocation) => (
                                                            <Checkbox
                                                                name={
                                                                    location.key === "UTLAND"
                                                                        ? "countries[]"
                                                                        : "municipals[]"
                                                                }
                                                                key={subLocation.key}
                                                                value={subLocation.key}
                                                                onChange={handleCheckboxClick(
                                                                    subLocation.key,
                                                                    subLocation.type,
                                                                )}
                                                                checked={
                                                                    query
                                                                        .getAll(QueryNames.MUNICIPAL)
                                                                        .includes(subLocation.key) ||
                                                                    query
                                                                        .getAll(QueryNames.COUNTRY)
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
