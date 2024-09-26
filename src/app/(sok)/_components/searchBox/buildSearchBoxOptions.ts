import { editedItemKey } from "@/app/(sok)/_components/filters/Engagement";
import { editedItemKey as editedOccupation } from "@/app/(sok)/_components/filters/Occupations";
import sortFiltersAlphabetically from "@/app/(sok)/_components/utils/sortFiltersAlphabetically";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import buildLocations from "@/app/(sok)/_components/utils/buildLocations";
import { labelForNeedDriversLicense } from "@/app/(sok)/_components/filters/DriversLicense";
import { labelForExperience } from "@/app/(sok)/_components/filters/Experience";
import { labelForEducation } from "@/app/(sok)/_components/filters/Education";
import { ComboboxOption } from "@navikt/ds-react/cjs/form/combobox/types";
import {
    COUNTRY,
    COUNTY,
    EDUCATION,
    ENGAGEMENT_TYPE,
    EXPERIENCE,
    EXTENT,
    INTERNATIONAL,
    MUNICIPAL,
    NEED_DRIVERS_LICENSE,
    OCCUPATION_FIRST_LEVEL,
    OCCUPATION_SECOND_LEVEL,
    PUBLISHED,
    REMOTE,
    SECTOR,
    WORK_LANGUAGE,
} from "@/app/(sok)/_components/searchParamNames";
import { PublishedLabels } from "@/app/(sok)/_utils/publishedLabels";
import FilterAggregations from "@/app/(sok)/_types/FilterAggregations";

const promotedOptions: ComboboxOption[] = [
    { label: "Deltid", value: `${EXTENT}-Deltid` },
    { label: labelForEducation("Ingen krav"), value: `${EDUCATION}-Ingen krav` },
    { label: labelForExperience("Ingen"), value: `${EXPERIENCE}-Ingen` },
    { label: labelForNeedDriversLicense("false"), value: `${NEED_DRIVERS_LICENSE}-false` },
    { label: "Engelsk", value: `${WORK_LANGUAGE}-Engelsk` },
    {
        label: PublishedLabels["now/d" as keyof typeof PublishedLabels],
        value: `${PUBLISHED}-${"now/d"}`,
    },
];

const promotedValues = promotedOptions.map((option) => option.value);

function getMunicipalOptions(locationList: LocationList[]): ComboboxOption[] {
    return locationList
        .map((location) => location.subLocations)
        .flat()
        .filter(
            (subLocation) =>
                subLocation.type === MUNICIPAL &&
                !["OSLO", "SVALBARD", "JAN MAYEN"].includes(subLocation.key.split(".")[1]),
        )
        .map(
            (municipal): ComboboxOption => ({
                label: fixLocationName(municipal.key.split(".")[1]),
                value: `${MUNICIPAL}-${municipal.key}`,
            }),
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getCountyOptions(locationList: LocationList[]): ComboboxOption[] {
    return locationList
        .filter((location) => location.type === COUNTY)
        .map(
            (county): ComboboxOption => ({
                label: fixLocationName(county.key),
                value: `${COUNTY}-${county.key}`,
            }),
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getCountryOptions(locationList: LocationList[]): ComboboxOption[] {
    return locationList
        .filter((location) => location.type === INTERNATIONAL)
        .map((location) => location.subLocations)
        .flat()
        .map(
            (country): ComboboxOption => ({
                label: fixLocationName(country.key),
                value: `${COUNTRY}-${country.key}`,
            }),
        );
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
                ? { label: "Yrke ikke oppgitt", value: `${OCCUPATION_FIRST_LEVEL}-${occupation.key}` }
                : {
                      label: occupation.key,
                      value: `${OCCUPATION_FIRST_LEVEL}-${occupation.key}`,
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
                value: `${OCCUPATION_SECOND_LEVEL}-${secondLevel.key}`,
            }),
        );
}

function getPublishedOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.published
        .map(
            (item): ComboboxOption => ({
                label: PublishedLabels[item.key as keyof typeof PublishedLabels],
                value: `${PUBLISHED}-${item.key}`,
            }),
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getSectorOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.sector.map(
        (item): ComboboxOption =>
            item.key === "Ikke oppgitt"
                ? { label: "Sektor ikke oppgitt", value: `${SECTOR}-${item.key}` }
                : { label: item.key, value: `${SECTOR}-${item.key}` },
    );
}

function getEngagementTypeOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.engagementTypes.map(
        (item): ComboboxOption =>
            editedItemKey(item.key) === "Ikke oppgitt"
                ? { label: "Ansettelsesform ikke oppgitt", value: `${ENGAGEMENT_TYPE}-${item.key}` }
                : { label: item.key, value: `${ENGAGEMENT_TYPE}-${item.key}` },
    );
}

function getExtentOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.extent
        .map(
            (item): ComboboxOption =>
                item.key === "Ikke oppgitt"
                    ? { label: "Omfang ikke oppgitt", value: `${EXTENT}-${item.key}` }
                    : {
                          label: item.key,
                          value: `${EXTENT}-${item.key}`,
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
                          value: `${EDUCATION}-${item.key}`,
                      }
                    : {
                          label: labelForEducation(item.key),
                          value: `${EDUCATION}-${item.key}`,
                      },
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getWorkLanguageOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.workLanguage
        .map(
            (item): ComboboxOption =>
                item.key === "Ikke oppgitt"
                    ? { label: "Arbeidsspråk ikke oppgitt", value: `${WORK_LANGUAGE}-${item.key}` }
                    : { label: item.key, value: `${WORK_LANGUAGE}-${item.key}` },
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getRemoteOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.remote.map(
        (item): ComboboxOption =>
            item.key === "Ikke oppgitt"
                ? { label: "Hjemmekontor ikke oppgitt", value: `${REMOTE}-${item.key}` }
                : { label: item.key, value: `${REMOTE}-${item.key}` },
    );
}

function getDriversLicenseOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.needDriversLicense
        .map(
            (licence): ComboboxOption =>
                licence.key === "Ikke oppgitt"
                    ? { label: "Førerkort ikke oppgitt", value: `${NEED_DRIVERS_LICENSE}-${licence.key}` }
                    : {
                          label: labelForNeedDriversLicense(licence.key),
                          value: `${NEED_DRIVERS_LICENSE}-${licence.key}`,
                      },
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getExperienceOptions(aggregations: FilterAggregations): ComboboxOption[] {
    return aggregations.experience
        .map(
            (experience): ComboboxOption =>
                experience.key === "Ikke oppgitt"
                    ? { label: "Erfaring ikke oppgitt", value: `${EXPERIENCE}-${experience.key}` }
                    : {
                          label: labelForExperience(experience.key),
                          value: `${EXPERIENCE}-${experience.key}`,
                      },
        )
        .filter((option) => !promotedValues.includes(option.value));
}

export function getSearchBoxOptions(aggregations: FilterAggregations, locations: LocationList[]): ComboboxOption[] {
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
        case MUNICIPAL:
            return "(Kommune)";
        case COUNTY:
            return "(Fylke)";
        case COUNTRY:
            return "(Land)";
        case OCCUPATION_FIRST_LEVEL:
            return "(Kategori)";
        case OCCUPATION_SECOND_LEVEL:
            return "(Kategori)";
        case SECTOR:
            return "(Sektor)";
        case ENGAGEMENT_TYPE:
            return "(Ansettelsesform)";
        case EXTENT:
            return "(Omfang)";
        case EDUCATION:
            return "(Krav om utdanning)";
        case WORK_LANGUAGE:
            return "(Arbeidsspråk)";
        case NEED_DRIVERS_LICENSE:
            return "(Førerkort)";
        case EXPERIENCE:
            return "(Arbeidserfaring)";
        default:
            return "";
    }
};

interface LocationList {
    type: string;
    key: string;
    count: number;
    subLocations: LocationList[];
}
