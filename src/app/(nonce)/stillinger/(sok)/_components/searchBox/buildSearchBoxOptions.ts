import { editedItemKey } from "@/app/(nonce)/stillinger/(sok)/_components/filters/Engagement";
import { editedItemKey as editedOccupation } from "@/app/(nonce)/stillinger/(sok)/_components/filters/Occupations";
import sortFiltersAlphabetically from "@/app/(nonce)/stillinger/(sok)/_components/utils/sortFiltersAlphabetically";
import fixLocationName from "@/app/(nonce)/stillinger/_common/utils/fixLocationName";
import buildLocations from "@/app/(nonce)/stillinger/(sok)/_components/utils/buildLocations";
import { labelForNeedDriversLicense } from "@/app/(nonce)/stillinger/(sok)/_components/filters/DriversLicense";
import { labelForExperience } from "@/app/(nonce)/stillinger/(sok)/_components/filters/Experience";
import { labelForEducation } from "@/app/(nonce)/stillinger/(sok)/_components/filters/Education";
import { ComboboxOption } from "@navikt/ds-react/cjs/form/combobox/types";
import { QueryNames } from "@/app/(nonce)/stillinger/(sok)/_utils/QueryNames";
import { PublishedLabels } from "@/app/(nonce)/stillinger/(sok)/_utils/publishedLabels";
import type FilterAggregations from "@/app/(nonce)/stillinger/_common/types/FilterAggregations";
import { type SearchLocation } from "@/app/(nonce)/stillinger/(sok)/page";

const promotedOptions: ComboboxOption[] = [
    { label: "Deltid", value: `${QueryNames.EXTENT}-Deltid` },
    { label: labelForEducation("Ingen krav"), value: `${QueryNames.EDUCATION}-Ingen krav` },
    { label: labelForExperience("Ingen"), value: `${QueryNames.EXPERIENCE}-Ingen` },
    { label: labelForNeedDriversLicense("false"), value: `${QueryNames.NEED_DRIVERS_LICENSE}-false` },
    { label: "Engelsk", value: `${QueryNames.WORK_LANGUAGE}-Engelsk` },
    {
        label: PublishedLabels["now/d" as keyof typeof PublishedLabels],
        value: `${QueryNames.PUBLISHED}-${"now/d"}`,
    },
];

const promotedValues = promotedOptions.map((option) => option.value);

function getMunicipalOptions(locationList: LocationList[]): ComboboxOption[] {
    return locationList
        .map((location) => location.subLocations)
        .flat()
        .filter(
            (subLocation) =>
                subLocation?.type === QueryNames.MUNICIPAL &&
                !["OSLO", "SVALBARD", "JAN MAYEN"].includes(subLocation.key.split(".")[1]),
        )
        .map(
            (municipal): ComboboxOption => ({
                label: fixLocationName(municipal?.key.split(".")[1]),
                value: `${QueryNames.MUNICIPAL}-${municipal?.key}`,
            }),
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getCountyOptions(locationList: LocationList[]): ComboboxOption[] {
    return locationList
        .filter((location) => location.type === QueryNames.COUNTY)
        .map(
            (county): ComboboxOption => ({
                label: fixLocationName(county.key),
                value: `${QueryNames.COUNTY}-${county.key}`,
            }),
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getCountryOptions(locationList: LocationList[]): ComboboxOption[] {
    return locationList
        .filter((location) => location.type === QueryNames.INTERNATIONAL)
        .map((location) => location.subLocations)
        .flat()
        .map(
            (country): ComboboxOption => ({
                label: fixLocationName(country?.key),
                value: `${QueryNames.COUNTRY}-${country?.key}`,
            }),
        );
}

function withSortedSecondLevelOccupations(aggregations: FilterAggregations) {
    return aggregations.occupationFirstLevels.map((item) => {
        const secondLevel = sortFiltersAlphabetically(item.occupationSecondLevels);
        return {
            secondLevel,
            ...item,
        };
    });
}

function getFirstLevelOccupationsOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return sortFiltersAlphabetically(withSortedSecondLevelOccupations(aggregations)).map(
        (occupation: { key: string }): ComboboxOption =>
            editedOccupation(occupation.key) === "Ikke oppgitt"
                ? { label: "Yrke ikke oppgitt", value: `${QueryNames.OCCUPATION_FIRST_LEVEL}-${occupation.key}` }
                : {
                      label: occupation.key,
                      value: `${QueryNames.OCCUPATION_FIRST_LEVEL}-${occupation.key}`,
                  },
    );
}

function getSecondLevelOccupationsOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return withSortedSecondLevelOccupations(aggregations)
        .map((item) => item.secondLevel)
        .flat()
        .map(
            (secondLevel): ComboboxOption => ({
                label: secondLevel.key.split(".")[1],
                value: `${QueryNames.OCCUPATION_SECOND_LEVEL}-${secondLevel.key}`,
            }),
        );
}

function getPublishedOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.published
        .map(
            (item): ComboboxOption => ({
                label: PublishedLabels[item.key as keyof typeof PublishedLabels],
                value: `${QueryNames.PUBLISHED}-${item.key}`,
            }),
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getSectorOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.sector.map(
        (item): ComboboxOption =>
            item.key === "Ikke oppgitt"
                ? { label: "Sektor ikke oppgitt", value: `${QueryNames.SECTOR}-${item.key}` }
                : { label: item.key, value: `${QueryNames.SECTOR}-${item.key}` },
    );
}

function getEngagementTypeOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.engagementTypes.map(
        (item): ComboboxOption =>
            editedItemKey(item.key) === "Ikke oppgitt"
                ? { label: "Ansettelsesform ikke oppgitt", value: `${QueryNames.ENGAGEMENT_TYPE}-${item.key}` }
                : { label: item.key, value: `${QueryNames.ENGAGEMENT_TYPE}-${item.key}` },
    );
}

function getExtentOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.extent
        .map(
            (item): ComboboxOption =>
                item.key === "Ikke oppgitt"
                    ? { label: "Omfang ikke oppgitt", value: `${QueryNames.EXTENT}-${item.key}` }
                    : {
                          label: item.key,
                          value: `${QueryNames.EXTENT}-${item.key}`,
                      },
        )
        .filter((option) => !promotedValues.includes(option.value));
}
function getEducationOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.education
        .map(
            (item): ComboboxOption =>
                item.key === "Ikke oppgitt"
                    ? {
                          label: "Krav til utdanning ikke oppgitt",
                          value: `${QueryNames.EDUCATION}-${item.key}`,
                      }
                    : {
                          label: labelForEducation(item.key),
                          value: `${QueryNames.EDUCATION}-${item.key}`,
                      },
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getWorkLanguageOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.workLanguage
        .map(
            (item): ComboboxOption =>
                item.key === "Ikke oppgitt"
                    ? { label: "Arbeidsspråk ikke oppgitt", value: `${QueryNames.WORK_LANGUAGE}-${item.key}` }
                    : { label: item.key, value: `${QueryNames.WORK_LANGUAGE}-${item.key}` },
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getRemoteOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.remote.map(
        (item): ComboboxOption =>
            item.key === "Ikke oppgitt"
                ? { label: "Hjemmekontor ikke oppgitt", value: `${QueryNames.REMOTE}-${item.key}` }
                : { label: item.key, value: `${QueryNames.REMOTE}-${item.key}` },
    );
}

function getDriversLicenseOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.needDriversLicense
        .map(
            (licence): ComboboxOption =>
                licence.key === "Ikke oppgitt"
                    ? { label: "Førerkort ikke oppgitt", value: `${QueryNames.NEED_DRIVERS_LICENSE}-${licence.key}` }
                    : {
                          label: labelForNeedDriversLicense(licence.key),
                          value: `${QueryNames.NEED_DRIVERS_LICENSE}-${licence.key}`,
                      },
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getExperienceOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.experience
        .map(
            (experience): ComboboxOption =>
                experience.key === "Ikke oppgitt"
                    ? { label: "Erfaring ikke oppgitt", value: `${QueryNames.EXPERIENCE}-${experience.key}` }
                    : {
                          label: labelForExperience(experience.key),
                          value: `${QueryNames.EXPERIENCE}-${experience.key}`,
                      },
        )
        .filter((option) => !promotedValues.includes(option.value));
}

export function getSearchBoxOptions(aggregations: FilterAggregations, locations: SearchLocation[]): ComboboxOption[] {
    const locationList = buildLocations(aggregations, locations);

    return [
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
    ];
}

export const findLabelForFilter = (value: string): string => {
    switch (value) {
        case QueryNames.MUNICIPAL:
            return "(Kommune)";
        case QueryNames.COUNTY:
            return "(Fylke)";
        case QueryNames.COUNTRY:
            return "(Land)";
        case QueryNames.OCCUPATION_FIRST_LEVEL:
            return "(Kategori)";
        case QueryNames.OCCUPATION_SECOND_LEVEL:
            return "(Kategori)";
        case QueryNames.SECTOR:
            return "(Sektor)";
        case QueryNames.ENGAGEMENT_TYPE:
            return "(Ansettelsesform)";
        case QueryNames.EXTENT:
            return "(Omfang)";
        case QueryNames.EDUCATION:
            return "(Krav om utdanning)";
        case QueryNames.WORK_LANGUAGE:
            return "(Arbeidsspråk)";
        case QueryNames.NEED_DRIVERS_LICENSE:
            return "(Førerkort)";
        case QueryNames.EXPERIENCE:
            return "(Arbeidserfaring)";
        default:
            return "";
    }
};

/**
 * TODO: gå gjennom Location type flere varianter
 * rundt om i koden som ligner men ikke helt samme.
 * Flytt typer ut i egen delt mappe
 */
export interface LocationList {
    type: string;
    key: string;
    count: number;
    subLocations?: LocationList[];
}
