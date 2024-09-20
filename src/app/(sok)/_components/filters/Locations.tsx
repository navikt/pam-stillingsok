import React, { ReactElement } from "react";
import { BodyShort, Box, Checkbox, Fieldset } from "@navikt/ds-react";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import buildLocations from "@/app/(sok)/_components/utils/buildLocations";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { COUNTRY, COUNTY, INTERNATIONAL, MUNICIPAL } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import FilterAggregations, { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

interface SubLocation {
    type: string;
    key: string;
    count: number;
}

interface Location {
    type: string;
    key: string;
    count: number;
    subLocations: SubLocation[];
}

interface LocationsProps {
    locations: [];
    updatedValues: FilterAggregations;
}
export default function Locations({ locations, updatedValues }: LocationsProps): ReactElement {
    const locationValues: Location[] = buildLocations(updatedValues, locations);
    const searchQuery = useSearchQuery();

    function handleLocationClick(value: string, type: string, checked: boolean): void {
        if (type === "county") {
            if (checked) {
                searchQuery.append(COUNTY, value);
            } else {
                searchQuery.remove(COUNTY, value);
            }
            searchQuery.getAll(MUNICIPAL).forEach((obj) => {
                if (obj.startsWith(`${value}.`)) {
                    searchQuery.remove(MUNICIPAL, obj);
                }
            });
            logFilterChanged({ name: "Sted", value: fixLocationName(value), checked, level: "Fylke" });
        } else if (type === "municipal") {
            if (checked) {
                searchQuery.append(MUNICIPAL, value);
            } else {
                searchQuery.remove(MUNICIPAL, value);
            }
            logFilterChanged({ name: "Sted", value: fixLocationName(value, true), checked, level: "Kommune" });
        } else if (type === "country") {
            if (checked) {
                searchQuery.append(COUNTRY, value);
            } else {
                searchQuery.remove(COUNTRY, value);
            }
            logFilterChanged({ name: "Sted", value: fixLocationName(value), checked, level: "Land" });
        } else if (type === "international") {
            if (checked) {
                searchQuery.set(INTERNATIONAL, "true");
            } else {
                searchQuery.remove(INTERNATIONAL);
                searchQuery.remove(COUNTRY);
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
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">sted</span>
                </>
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
                                    checked={searchQuery.get(INTERNATIONAL) === "true"}
                                >
                                    Utland ({updatedValues.totalInternational})
                                </Checkbox>
                            ) : (
                                <Checkbox
                                    name="counties[]"
                                    value={location.key}
                                    onChange={handleCheckboxClick(location.key, location.type)}
                                    checked={searchQuery.getAll(COUNTY).includes(location.key)}
                                >
                                    <span translate="no">{`${fixLocationName(location.key)} (${location.count})`}</span>
                                </Checkbox>
                            )}

                            {(searchQuery.getAll(COUNTY).includes(location.key) ||
                                (location.key === "UTLAND" && searchQuery.get(INTERNATIONAL) === "true")) &&
                                location.key !== "OSLO" &&
                                location.key !== "SVALBARD" && (
                                    <Box paddingInline="8 0">
                                        <Fieldset hideLegend legend={`Områder i ${fixLocationName(location.key)}`}>
                                            <div>
                                                {location.subLocations &&
                                                    location.subLocations
                                                        .sort((a: FilterAggregation, b: FilterAggregation) =>
                                                            a.key.localeCompare(b.key, "no"),
                                                        )
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
                                                                    searchQuery
                                                                        .getAll(MUNICIPAL)
                                                                        .includes(subLocation.key) ||
                                                                    searchQuery
                                                                        .getAll(COUNTRY)
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