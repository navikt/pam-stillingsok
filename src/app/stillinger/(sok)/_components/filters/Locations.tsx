import React from "react";
import { BodyShort, Box, Checkbox, Fieldset } from "@navikt/ds-react";
import fixLocationName from "@/app/stillinger/_common/utils/fixLocationName";
import buildLocations from "@/app/stillinger/(sok)/_components/utils/buildLocations";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { type SearchLocation } from "@/app/_common/geografi/locationsMapping";

type LocationsProps = {
    locations: readonly SearchLocation[];
    updatedValues: FilterAggregations;
};
type LocationType = "county" | "municipal" | "country" | "international";

const changedKeyByType = {
    county: QueryNames.COUNTY,
    municipal: QueryNames.MUNICIPAL,
    country: QueryNames.COUNTRY,
    international: QueryNames.INTERNATIONAL,
} as const satisfies Record<LocationType, string>;

function isLocationType(value: string): value is LocationType {
    return value === "county" || value === "municipal" || value === "country" || value === "international";
}

export default function Locations({ locations, updatedValues }: LocationsProps) {
    const locationValues = buildLocations(updatedValues, locations);
    const query = useQuery();

    function handleLocationClick(value: string, type: string, checked: boolean) {
        if (!isLocationType(type)) {
            return;
        }
        query.update(
            (draft) => {
                if (type === "county") {
                    if (checked) {
                        if (!draft.getAll(QueryNames.COUNTY).includes(value)) {
                            draft.append(QueryNames.COUNTY, value);
                        }
                    } else {
                        draft.delete(QueryNames.COUNTY, value);
                    }

                    const municipalValues = draft.getAll(QueryNames.MUNICIPAL);

                    municipalValues.forEach((municipalValue) => {
                        if (municipalValue.startsWith(`${value}.`)) {
                            draft.delete(QueryNames.MUNICIPAL, municipalValue);
                        }
                    });

                    return;
                }

                if (type === "municipal") {
                    if (checked) {
                        if (!draft.getAll(QueryNames.MUNICIPAL).includes(value)) {
                            draft.append(QueryNames.MUNICIPAL, value);
                        }
                    } else {
                        draft.delete(QueryNames.MUNICIPAL, value);
                    }

                    return;
                }

                if (type === "country") {
                    if (checked) {
                        if (!draft.getAll(QueryNames.COUNTRY).includes(value)) {
                            draft.append(QueryNames.COUNTRY, value);
                        }
                    } else {
                        draft.delete(QueryNames.COUNTRY, value);
                    }

                    return;
                }

                if (type === "international") {
                    if (checked) {
                        draft.set(QueryNames.INTERNATIONAL, "true");
                    } else {
                        draft.delete(QueryNames.INTERNATIONAL);
                        draft.delete(QueryNames.COUNTRY);
                    }
                }
            },
            {
                changedKey: changedKeyByType[type],
            },
        );
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
                                    <Box paddingInline="space-48 space-0">
                                        <Fieldset hideLegend legend={`Områder i ${fixLocationName(location.key)}`}>
                                            <div>
                                                {location.subLocations &&
                                                    location.subLocations.map((subLocation) => (
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
