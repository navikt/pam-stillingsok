import { editedItemKey } from "@/app/(sok)/_components/filters/Engagement";
import sortValuesByFirstLetter from "@/app/(sok)/_components/utils/sortValuesByFirstLetter";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import buildLocations from "@/app/(sok)/_components/utils/buildLocations";
import { PublishedLabelsEnum } from "@/app/(sok)/_utils/query";
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
} from "@/app/(sok)/_components/searchBox/filterTypes";

function getMunicipalOptions(locationList: LocationList[]) {
    return locationList
        .map((location) => location.subLocations)
        .flat()
        .filter((subLocation) => subLocation.type === MUNICIPAL)
        .map(
            (municipal): ComboboxOption => ({
                label: fixLocationName(municipal.key.split(".")[1]),
                value: `${MUNICIPAL}-${municipal.key}`,
            }),
        );
}

function getCountyOptions(locationList: LocationList[]) {
    return locationList
        .filter((location) => location.type === COUNTY)
        .map(
            (county): ComboboxOption => ({
                label: fixLocationName(county.key),
                value: `${COUNTY}-${county.key}`,
            }),
        );
}

function getCountryOptions(locationList: LocationList[]) {
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

function withSortedSecondLevelOccupations(aggregations: Aggregations) {
    return aggregations.occupationFirstLevels.map((item) => {
        const secondLevel = sortValuesByFirstLetter(item.occupationSecondLevels);
        return {
            secondLevel,
            ...item,
        };
    });
}

function getFirstLevelOccupationsOptions(aggregations: Aggregations) {
    return sortValuesByFirstLetter(withSortedSecondLevelOccupations(aggregations)).map(
        (occupation: { key: string }): ComboboxOption => ({
            label: occupation.key,
            value: `${OCCUPATION_FIRST_LEVEL}-${occupation.key}`,
        }),
    );
}

function getSecondLevelOccupationsOptions(aggregations: Aggregations) {
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

function getPublishedOptions(aggregations: Aggregations) {
    return aggregations.published.map(
        (item): ComboboxOption => ({
            label: PublishedLabelsEnum[item.key],
            value: `${PUBLISHED}-${item.key}`,
        }),
    );
}

function getSectorOptions(aggregations: Aggregations) {
    return aggregations.sector.map(
        (item): ComboboxOption =>
            item.key === "Ikke oppgitt"
                ? { label: "Sektor ikke oppgitt", value: `${SECTOR}-${item.key}` }
                : { label: item.key, value: `${SECTOR}-${item.key}` },
    );
}

function getEngagementTypeOptions(aggregations: Aggregations) {
    return aggregations.engagementTypes.map(
        (item): ComboboxOption =>
            editedItemKey(item.key) === "Ikke oppgitt"
                ? { label: "Ansettelsesform ikke oppgitt", value: `${ENGAGEMENT_TYPE}-${item.key}` }
                : { label: item.key, value: `${ENGAGEMENT_TYPE}-${item.key}` },
    );
}

function getExtentOptions(aggregations: Aggregations) {
    return aggregations.extent.map(
        (item): ComboboxOption => ({
            label: item.key,
            value: `${EXTENT}-${item.key}`,
        }),
    );
}
function getEducationOptions(aggregations: Aggregations) {
    return aggregations.education.map(
        (item): ComboboxOption =>
            item.key === "Ikke oppgitt"
                ? {
                      label: "Utdanning ikke oppgitt",
                      value: `${EDUCATION}-${item.key}`,
                  }
                : {
                      label: labelForEducation(item.key),
                      value: `${EDUCATION}-${item.key}`,
                  },
    );
}

function getWorkLanguageOptions(aggregations: Aggregations) {
    return aggregations.workLanguage.map(
        (item): ComboboxOption =>
            item.key === "Ikke oppgitt"
                ? { label: "Arbeidsspråk ikke oppgitt", value: `${WORK_LANGUAGE}-${item.key}` }
                : { label: item.key, value: `${WORK_LANGUAGE}-${item.key}` },
    );
}

function getRemoteOptions(aggregations: Aggregations) {
    return aggregations.remote.map(
        (item): ComboboxOption =>
            item.key === "Ikke oppgitt"
                ? { label: "Hjemmekontor ikke oppgitt", value: `${REMOTE}-${item.key}` }
                : { label: item.key, value: `${REMOTE}-${item.key}` },
    );
}

function getOccupationSuggestionOptions(allSuggestions: string[]) {
    return allSuggestions.map(
        (suggestion): ComboboxOption => ({
            label: suggestion,
            value: `${OCCUPATION}-${suggestion}`,
        }),
    );
}

function getDriversLicenseOptions(aggregations: Aggregations) {
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

function getExperienceOptions(aggregations: Aggregations) {
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
): SuggestionList[] {
    const locationList = buildLocations(aggregations, locations);

    return [
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

interface SuggestionList {
    label: string;
    value: string;
}

// TODO: move to SearchBox
export interface Query {
    from: number;
    size: number;
    q: string;
    municipals?: string[];
    counties?: string[];
    countries?: string[];
    international: boolean;
    occupationFirstLevels?: string[];
    occupationSecondLevels?: string[];
    occupations?: string[];
    published?: string;
    sector?: string[];
    engagementType?: string[];
    extent?: string[];
    education?: string[];
    workLanguage?: string[];
    remote?: string[];
    needDriversLicense?: string[];
    experience?: string[];
    sort: string;
    v: string;
}
