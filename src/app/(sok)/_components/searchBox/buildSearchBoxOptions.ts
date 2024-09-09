import { editedItemKey } from "@/app/(sok)/_components/filters/Engagement";
import sortValuesByFirstLetter from "@/app/(sok)/_components/utils/sortValuesByFirstLetter";
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
    OCCUPATION,
    OCCUPATION_FIRST_LEVEL,
    OCCUPATION_SECOND_LEVEL,
    PUBLISHED,
    REMOTE,
    SECTOR,
    WORK_LANGUAGE,
} from "@/app/(sok)/_components/searchParamNames";
import { PublishedLabelsEnum } from "@/app/(sok)/_components/filters/Published";

const promotedOptions: ComboboxOption[] = [
    { label: "Butikkmedarbeider", value: `${OCCUPATION}-Butikkmedarbeider` },
    { label: fixLocationName("TRØNDELAG.TRONDHEIM", true), value: `${MUNICIPAL}-TRØNDELAG.TRONDHEIM` },
    { label: fixLocationName("VESTLAND.BERGEN", true), value: `${MUNICIPAL}-VESTLAND.BERGEN` },
    { label: "Deltid", value: `${EXTENT}-Deltid` },
    { label: labelForEducation("Ingen krav"), value: `${EDUCATION}-Ingen krav` },
    { label: "Engelsk", value: `${WORK_LANGUAGE}-Engelsk` },
    {
        label: PublishedLabelsEnum["now/d" as keyof typeof PublishedLabelsEnum],
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
function withSortedSecondLevelOccupations(aggregations: Aggregations) {
    return aggregations.occupationFirstLevels.map((item) => {
        const secondLevel = sortValuesByFirstLetter(item.occupationSecondLevels);
        return {
            secondLevel,
            ...item,
        };
    });
}

function getFirstLevelOccupationsOptions(aggregations: Aggregations): ComboboxOption[] {
    return sortValuesByFirstLetter(withSortedSecondLevelOccupations(aggregations)).map(
        (occupation: { key: string }): ComboboxOption => ({
            label: occupation.key,
            value: `${OCCUPATION_FIRST_LEVEL}-${occupation.key}`,
        }),
    );
}

function getSecondLevelOccupationsOptions(aggregations: Aggregations): ComboboxOption[] {
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

function getPublishedOptions(aggregations: Aggregations): ComboboxOption[] {
    return aggregations.published
        .map(
            (item): ComboboxOption => ({
                label: PublishedLabelsEnum[item.key as keyof typeof PublishedLabelsEnum],
                value: `${PUBLISHED}-${item.key}`,
            }),
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getSectorOptions(aggregations: Aggregations): ComboboxOption[] {
    return aggregations.sector.map(
        (item): ComboboxOption =>
            item.key === "Ikke oppgitt"
                ? { label: "Sektor ikke oppgitt", value: `${SECTOR}-${item.key}` }
                : { label: item.key, value: `${SECTOR}-${item.key}` },
    );
}

function getEngagementTypeOptions(aggregations: Aggregations): ComboboxOption[] {
    return aggregations.engagementTypes.map(
        (item): ComboboxOption =>
            editedItemKey(item.key) === "Ikke oppgitt"
                ? { label: "Ansettelsesform ikke oppgitt", value: `${ENGAGEMENT_TYPE}-${item.key}` }
                : { label: item.key, value: `${ENGAGEMENT_TYPE}-${item.key}` },
    );
}

function getExtentOptions(aggregations: Aggregations): ComboboxOption[] {
    return aggregations.extent
        .map(
            (item): ComboboxOption => ({
                label: item.key,
                value: `${EXTENT}-${item.key}`,
            }),
        )
        .filter((option) => !promotedValues.includes(option.value));
}
function getEducationOptions(aggregations: Aggregations): ComboboxOption[] {
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

function getWorkLanguageOptions(aggregations: Aggregations): ComboboxOption[] {
    return aggregations.workLanguage
        .map(
            (item): ComboboxOption =>
                item.key === "Ikke oppgitt"
                    ? { label: "Arbeidsspråk ikke oppgitt", value: `${WORK_LANGUAGE}-${item.key}` }
                    : { label: item.key, value: `${WORK_LANGUAGE}-${item.key}` },
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getRemoteOptions(aggregations: Aggregations): ComboboxOption[] {
    return aggregations.remote.map(
        (item): ComboboxOption =>
            item.key === "Ikke oppgitt"
                ? { label: "Hjemmekontor ikke oppgitt", value: `${REMOTE}-${item.key}` }
                : { label: item.key, value: `${REMOTE}-${item.key}` },
    );
}

function getOccupationSuggestionOptions(allSuggestions: string[]): ComboboxOption[] {
    return allSuggestions
        .map(
            (suggestion): ComboboxOption => ({
                label: suggestion,
                value: `${OCCUPATION}-${suggestion}`,
            }),
        )
        .filter((option) => !promotedValues.includes(option.value));
}

function getDriversLicenseOptions(aggregations: Aggregations): ComboboxOption[] {
    return aggregations.needDriversLicense.map(
        (licence): ComboboxOption =>
            licence.key === "Ikke oppgitt"
                ? { label: "Førerkort ikke oppgitt", value: `${NEED_DRIVERS_LICENSE}-${licence.key}` }
                : {
                      label: labelForNeedDriversLicense(licence.key),
                      value: `${NEED_DRIVERS_LICENSE}-${licence.key}`,
                  },
    );
}

function getExperienceOptions(aggregations: Aggregations): ComboboxOption[] {
    return aggregations.experience.map(
        (experience): ComboboxOption =>
            experience.key === "Ikke oppgitt"
                ? { label: "Erfaring ikke oppgitt", value: `${EXPERIENCE}-${experience.key}` }
                : {
                      label: labelForExperience(experience.key),
                      value: `${EXPERIENCE}-${experience.key}`,
                  },
    );
}

export function getSearchBoxOptions(
    aggregations: Aggregations,
    locations: LocationList[],
    allSuggestions: string[],
): ComboboxOption[] {
    const locationList = buildLocations(aggregations, locations);

    return [
        ...promotedOptions,
        ...getMunicipalOptions(locationList),
        ...getCountyOptions(locationList),
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
        ...getOccupationSuggestionOptions(allSuggestions),
    ];
}

interface Aggregations {
    occupationFirstLevels: { key: string; occupationSecondLevels: { key: string }[] }[];
    published: { key: string }[];
    sector: { key: string }[];
    engagementTypes: { key: string }[];
    extent: { key: string }[];
    education: { key: string }[];
    workLanguage: { key: string }[];
    remote: { key: string }[];
    needDriversLicense: { key: string }[];
    experience: { key: string }[];
}

interface LocationList {
    type: string;
    key: string;
    count: number;
    subLocations: LocationList[];
}
