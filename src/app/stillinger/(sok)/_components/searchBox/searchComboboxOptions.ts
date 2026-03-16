import sortFiltersAlphabetically from "@/app/stillinger/(sok)/_components/utils/sortFiltersAlphabetically";
import fixLocationName from "@/app/stillinger/_common/utils/fixLocationName";
import buildLocations from "@/app/stillinger/(sok)/_components/utils/buildLocations";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { PublishedLabels } from "@/app/stillinger/(sok)/_utils/publishedLabels";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { type SearchLocation } from "@/app/_common/geografi/locationsMapping";
import {
    labelForEducation,
    labelForExperience,
    labelForNeedDriversLicense,
    labelForUnder18,
} from "@/app/stillinger/(sok)/_components/filters/filterLabelUtils";
import { editedItemKey, editedOccupation } from "@/app/stillinger/(sok)/_components/filters/getKeys";

export type SearchComboboxOption = Readonly<{
    label: string;
    value: string;
}>;

type LocationList = Readonly<{
    type: string;
    key: string;
    count: number;
    subLocations?: readonly LocationList[];
}>;

const promotedOptions: readonly SearchComboboxOption[] = [
    { label: "Deltid", value: `${QueryNames.EXTENT}-Deltid` },
    { label: labelForEducation("Ingen krav"), value: `${QueryNames.EDUCATION}-Ingen krav` },
    { label: labelForExperience("Ingen"), value: `${QueryNames.EXPERIENCE}-Ingen` },
    { label: labelForNeedDriversLicense("false"), value: `${QueryNames.NEED_DRIVERS_LICENSE}-false` },
    { label: "Engelsk", value: `${QueryNames.WORK_LANGUAGE}-Engelsk` },
    { label: labelForUnder18("true"), value: `${QueryNames.UNDER18}-true` },
    {
        label: PublishedLabels["now/d" as keyof typeof PublishedLabels],
        value: `${QueryNames.PUBLISHED}-now/d`,
    },
] as const;

const promotedValues = new Set(
    promotedOptions.map((option) => {
        return option.value;
    }),
);

function excludePromotedOptions(options: readonly SearchComboboxOption[]): SearchComboboxOption[] {
    return options.filter((option) => {
        return !promotedValues.has(option.value);
    });
}

function withFilterLabel(option: SearchComboboxOption): SearchComboboxOption {
    const filterKey = option.value.split("-")[0];
    const filterLabel = findLabelForFilter(filterKey);

    if (filterLabel.length === 0) {
        return option;
    }

    return {
        label: `${option.label} ${filterLabel}`,
        value: option.value,
    };
}

function getMunicipalOptions(locationList: readonly LocationList[]): SearchComboboxOption[] {
    const municipals = locationList
        .flatMap((location) => {
            return location.subLocations ?? [];
        })
        .filter((subLocation) => {
            const municipalKey = subLocation.key.split(".")[1] ?? "";

            return (
                subLocation.type === QueryNames.MUNICIPAL && !["OSLO", "SVALBARD", "JAN MAYEN"].includes(municipalKey)
            );
        })
        .map((municipal) => {
            return {
                label: fixLocationName(municipal.key.split(".")[1] ?? ""),
                value: `${QueryNames.MUNICIPAL}-${municipal.key}`,
            };
        });

    return excludePromotedOptions(municipals);
}

function getCountyOptions(locationList: readonly LocationList[]): SearchComboboxOption[] {
    const counties = locationList
        .filter((location) => {
            return location.type === QueryNames.COUNTY;
        })
        .map((county) => {
            return {
                label: fixLocationName(county.key),
                value: `${QueryNames.COUNTY}-${county.key}`,
            };
        });

    return excludePromotedOptions(counties);
}

function getCountryOptions(locationList: readonly LocationList[]): SearchComboboxOption[] {
    return locationList
        .filter((location) => {
            return location.type === QueryNames.INTERNATIONAL;
        })
        .flatMap((location) => {
            return location.subLocations ?? [];
        })
        .map((country) => {
            return {
                label: fixLocationName(country.key),
                value: `${QueryNames.COUNTRY}-${country.key}`,
            };
        });
}

function withSortedSecondLevelOccupations(aggregations: FilterAggregations): ReadonlyArray<
    Readonly<{
        key: string;
        occupationSecondLevels: Readonly<{ key: string }>[];
        secondLevel: Readonly<{ key: string }>[];
    }>
> {
    return aggregations.occupationFirstLevels.map((item) => {
        return {
            ...item,
            secondLevel: sortFiltersAlphabetically(item.occupationSecondLevels),
        };
    });
}

function getFirstLevelOccupationsOptions(aggregations: FilterAggregations): SearchComboboxOption[] {
    return sortFiltersAlphabetically(withSortedSecondLevelOccupations(aggregations)).map((occupation) => {
        if (editedOccupation(occupation.key) === "Ikke oppgitt") {
            return {
                label: "Yrke ikke oppgitt",
                value: `${QueryNames.OCCUPATION_FIRST_LEVEL}-${occupation.key}`,
            };
        }

        return {
            label: occupation.key,
            value: `${QueryNames.OCCUPATION_FIRST_LEVEL}-${occupation.key}`,
        };
    });
}

function getSecondLevelOccupationsOptions(aggregations: FilterAggregations): SearchComboboxOption[] {
    return withSortedSecondLevelOccupations(aggregations)
        .flatMap((item) => {
            return item.secondLevel;
        })
        .map((secondLevel) => {
            return {
                label: secondLevel.key.split(".")[1] ?? "",
                value: `${QueryNames.OCCUPATION_SECOND_LEVEL}-${secondLevel.key}`,
            };
        });
}

function getPublishedOptions(aggregations: FilterAggregations): SearchComboboxOption[] {
    const options = aggregations.published.map((item) => {
        return {
            label: PublishedLabels[item.key as keyof typeof PublishedLabels],
            value: `${QueryNames.PUBLISHED}-${item.key}`,
        };
    });

    return excludePromotedOptions(options);
}

function getSectorOptions(aggregations: FilterAggregations): SearchComboboxOption[] {
    return aggregations.sector.map((item) => {
        if (item.key === "Ikke oppgitt") {
            return {
                label: "Sektor ikke oppgitt",
                value: `${QueryNames.SECTOR}-${item.key}`,
            };
        }

        return {
            label: item.key,
            value: `${QueryNames.SECTOR}-${item.key}`,
        };
    });
}

function getEngagementTypeOptions(aggregations: FilterAggregations): SearchComboboxOption[] {
    return aggregations.engagementTypes.map((item) => {
        if (editedItemKey(item.key) === "Ikke oppgitt") {
            return {
                label: "Ansettelsesform ikke oppgitt",
                value: `${QueryNames.ENGAGEMENT_TYPE}-${item.key}`,
            };
        }

        return {
            label: item.key,
            value: `${QueryNames.ENGAGEMENT_TYPE}-${item.key}`,
        };
    });
}

function getExtentOptions(aggregations: FilterAggregations): SearchComboboxOption[] {
    const options = aggregations.extent.map((item) => {
        if (item.key === "Ikke oppgitt") {
            return {
                label: "Omfang ikke oppgitt",
                value: `${QueryNames.EXTENT}-${item.key}`,
            };
        }

        return {
            label: item.key,
            value: `${QueryNames.EXTENT}-${item.key}`,
        };
    });

    return excludePromotedOptions(options);
}

function getEducationOptions(aggregations: FilterAggregations): SearchComboboxOption[] {
    const options = aggregations.education.map((item) => {
        if (item.key === "Ikke oppgitt") {
            return {
                label: "Krav til utdanning ikke oppgitt",
                value: `${QueryNames.EDUCATION}-${item.key}`,
            };
        }

        return {
            label: labelForEducation(item.key),
            value: `${QueryNames.EDUCATION}-${item.key}`,
        };
    });

    return excludePromotedOptions(options);
}

function getWorkLanguageOptions(aggregations: FilterAggregations): SearchComboboxOption[] {
    const options = aggregations.workLanguage.map((item) => {
        if (item.key === "Ikke oppgitt") {
            return {
                label: "Arbeidsspråk ikke oppgitt",
                value: `${QueryNames.WORK_LANGUAGE}-${item.key}`,
            };
        }

        return {
            label: item.key,
            value: `${QueryNames.WORK_LANGUAGE}-${item.key}`,
        };
    });

    return excludePromotedOptions(options);
}

function getRemoteOptions(aggregations: FilterAggregations): SearchComboboxOption[] {
    return aggregations.remote.map((item) => {
        if (item.key === "Ikke oppgitt") {
            return {
                label: "Hjemmekontor ikke oppgitt",
                value: `${QueryNames.REMOTE}-${item.key}`,
            };
        }

        return {
            label: item.key,
            value: `${QueryNames.REMOTE}-${item.key}`,
        };
    });
}

function getDriversLicenseOptions(aggregations: FilterAggregations): SearchComboboxOption[] {
    const options = aggregations.needDriversLicense.map((license) => {
        if (license.key === "Ikke oppgitt") {
            return {
                label: "Førerkort ikke oppgitt",
                value: `${QueryNames.NEED_DRIVERS_LICENSE}-${license.key}`,
            };
        }

        return {
            label: labelForNeedDriversLicense(license.key),
            value: `${QueryNames.NEED_DRIVERS_LICENSE}-${license.key}`,
        };
    });

    return excludePromotedOptions(options);
}

function getExperienceOptions(aggregations: FilterAggregations): SearchComboboxOption[] {
    const options = aggregations.experience.map((experience) => {
        if (experience.key === "Ikke oppgitt") {
            return {
                label: "Erfaring ikke oppgitt",
                value: `${QueryNames.EXPERIENCE}-${experience.key}`,
            };
        }

        return {
            label: labelForExperience(experience.key),
            value: `${QueryNames.EXPERIENCE}-${experience.key}`,
        };
    });

    return excludePromotedOptions(options);
}

function getUnder18Options(aggregations: FilterAggregations): SearchComboboxOption[] {
    return aggregations.under18
        .filter((item) => {
            return item.key === "true";
        })
        .map((item) => {
            return {
                label: labelForUnder18(item.key),
                value: `${QueryNames.UNDER18}-${item.key}`,
            };
        });
}

export function buildSearchComboboxOptions(
    aggregations: FilterAggregations,
    locations: readonly SearchLocation[],
): SearchComboboxOption[] {
    const locationList = buildLocations(aggregations, locations);

    const options: SearchComboboxOption[] = [
        ...promotedOptions,
        ...getCountyOptions(locationList),
        ...getMunicipalOptions(locationList),
        ...getCountryOptions(locationList),
        ...getFirstLevelOccupationsOptions(aggregations),
        ...getSecondLevelOccupationsOptions(aggregations),
        ...getPublishedOptions(aggregations),
        ...getSectorOptions(aggregations),
        ...getEngagementTypeOptions(aggregations),
        ...getExtentOptions(aggregations),
        ...getEducationOptions(aggregations),
        ...getWorkLanguageOptions(aggregations),
        ...getRemoteOptions(aggregations),
        ...getDriversLicenseOptions(aggregations),
        ...getExperienceOptions(aggregations),
        ...getUnder18Options(aggregations),
    ];

    return options.map((option) => {
        return withFilterLabel(option);
    });
}

export function findLabelForFilter(value: string): string {
    switch (value) {
        case QueryNames.MUNICIPAL: {
            return "(Kommune)";
        }
        case QueryNames.COUNTY: {
            return "(Fylke)";
        }
        case QueryNames.COUNTRY: {
            return "(Land)";
        }
        case QueryNames.OCCUPATION_FIRST_LEVEL: {
            return "(Kategori)";
        }
        case QueryNames.OCCUPATION_SECOND_LEVEL: {
            return "(Kategori)";
        }
        case QueryNames.SECTOR: {
            return "(Sektor)";
        }
        case QueryNames.ENGAGEMENT_TYPE: {
            return "(Ansettelsesform)";
        }
        case QueryNames.EXTENT: {
            return "(Omfang)";
        }
        case QueryNames.EDUCATION: {
            return "(Krav om utdanning)";
        }
        case QueryNames.WORK_LANGUAGE: {
            return "(Arbeidsspråk)";
        }
        case QueryNames.NEED_DRIVERS_LICENSE: {
            return "(Førerkort)";
        }
        case QueryNames.EXPERIENCE: {
            return "(Arbeidserfaring)";
        }
        case QueryNames.UNDER18: {
            return "(Under 18 år)";
        }
        default: {
            return "";
        }
    }
}
