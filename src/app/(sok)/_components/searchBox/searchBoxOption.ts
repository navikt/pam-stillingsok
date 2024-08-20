import { editedItemKey } from "@/app/(sok)/_components/filters/Engagement";
import sortValuesByFirstLetter from "@/app/(sok)/_components/utils/sortValuesByFirstLetter";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import buildLocations from "@/app/(sok)/_components/utils/buildLocations";
import { PublishedLabelsEnum } from "@/app/(sok)/_utils/query";
import { labelForNeedDriversLicense } from "@/app/(sok)/_components/filters/DriversLicense";
import { labelForExperience } from "@/app/(sok)/_components/filters/Experience";
import { labelForEducation } from "@/app/(sok)/_components/filters/Education";
import { ComboboxOption } from "@navikt/ds-react/cjs/form/combobox/types";

export const MUNICIPAL = "municipal";
export const COUNTY = "county";
export const COUNTRY = "country";
export const INTERNATIONAL = "international";
export const OCCUPATION_SECOND_LEVEL = "occupationSecondLevel";
export const OCCUPATION_FIRST_LEVEL = "occupationFirstLevel";
export const OCCUPATION = "occupation";
export const PUBLISHED = "published";
export const SECTOR = "sector";
export const ENGAGEMENT_TYPE = "engagementType";
export const EXTENT = "extent";
export const EDUCATION = "education";
export const WORK_LANGUAGE = "workLanguage";
export const REMOTE = "remote";
export const NEED_DRIVERS_LICENSE = "needDriversLicense";
export const EXPERIENCE = "experience";

export function getSearchBoxOptions(
    aggregations: Aggregations,
    locations: Location[],
    allSuggestions: string[],
): SuggestionList[] {
    const locationList = buildLocations(aggregations, locations);

    const municipalList: ComboboxOption[] = locationList
        .map((location) => location.subLocations)
        .flat()
        .filter((subLocation) => subLocation.type === MUNICIPAL)
        .map((municipal) => ({
            label: fixLocationName(municipal.key.split(".")[1]),
            value: `${MUNICIPAL}-${municipal.key}`,
        }));

    const countyList: ComboboxOption[] = locationList
        .filter((location) => location.type === COUNTY)
        .map((county) => ({
            label: fixLocationName(county.key),
            value: `${COUNTY}-${county.key}`,
        }));

    const countryList: ComboboxOption[] = locationList
        .filter((location) => location.type === INTERNATIONAL)
        .map((location) => location.subLocations)
        .flat()
        .map((country) => ({
            label: fixLocationName(country.key),
            value: `${COUNTRY}-${country.key}`,
        }));

    const withSortedSecondLevelOccupations = aggregations.occupationFirstLevels.map((item) => {
        const secondLevel = sortValuesByFirstLetter(item.occupationSecondLevels);
        return {
            secondLevel,
            ...item,
        };
    });
    const sortedByLetterFirstLevelOccupationsList = sortValuesByFirstLetter(withSortedSecondLevelOccupations).map(
        (occupation: { key: string }): ComboboxOption => ({
            label: occupation.key,
            value: `${OCCUPATION_FIRST_LEVEL}-${occupation.key}`,
        }),
    );

    const secondLevelOccupationsList: ComboboxOption[] = withSortedSecondLevelOccupations
        .map((item) => item.secondLevel)
        .flat()
        .map((secondLevel) => ({
            label: secondLevel.key.split(".")[1],
            value: `${OCCUPATION_SECOND_LEVEL}-${secondLevel.key}`,
        }));

    const publishedList: ComboboxOption[] = aggregations.published.map((item) => ({
        label: PublishedLabelsEnum[item.key],
        value: `${PUBLISHED}-${item.key}`,
    }));

    const sectorList: ComboboxOption[] = aggregations.sector.map((item) =>
        item.key === "Ikke oppgitt"
            ? { label: "Sektor ikke oppgitt", value: `${SECTOR}-${item.key}` }
            : { label: item.key, value: `${SECTOR}-${item.key}` },
    );

    const engagementTypeList: ComboboxOption[] = aggregations.engagementTypes.map((item) =>
        editedItemKey(item.key) === "Ikke oppgitt"
            ? { label: "Ansettelsesform ikke oppgitt", value: `${ENGAGEMENT_TYPE}-${item.key}` }
            : { label: item.key, value: `${ENGAGEMENT_TYPE}-${item.key}` },
    );
    const extentList: ComboboxOption[] = aggregations.extent.map((item) => ({
        label: item.key,
        value: `${EXTENT}-${item.key}`,
    }));

    const educationList: ComboboxOption[] = aggregations.education.map((item) =>
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

    const workLanguageList: ComboboxOption[] = aggregations.workLanguage.map((item) =>
        item.key === "Ikke oppgitt"
            ? { label: "Arbeidsspråk ikke oppgitt", value: `${WORK_LANGUAGE}-${item.key}` }
            : { label: item.key, value: `${WORK_LANGUAGE}-${item.key}` },
    );

    const remoteList: ComboboxOption[] = aggregations.remote.map((item) =>
        item.key === "Ikke oppgitt"
            ? { label: "Hjemmekontor ikke oppgitt", value: `${REMOTE}-${item.key}` }
            : { label: item.key, value: `${REMOTE}-${item.key}` },
    );

    const occupationSuggestionList: ComboboxOption[] = allSuggestions.map((suggestion) => ({
        label: suggestion,
        value: `${OCCUPATION}-${suggestion}`,
    }));

    const needDriversLicenseList: ComboboxOption[] = aggregations.needDriversLicense.map((licence) =>
        licence.key === "Ikke oppgitt"
            ? { label: "Førerkort ikke oppgitt", value: `${NEED_DRIVERS_LICENSE}-${licence.key}` }
            : {
                  label: labelForNeedDriversLicense(licence.key),
                  value: `${NEED_DRIVERS_LICENSE}-${licence.key}`,
              },
    );

    const experienceList: ComboboxOption[] = aggregations.experience.map((experience) =>
        experience.key === "Ikke oppgitt"
            ? { label: "Erfaring ikke oppgitt", value: `${EXPERIENCE}-${experience.key}` }
            : {
                  label: labelForExperience(experience.key),
                  value: `${EXPERIENCE}-${experience.key}`,
              },
    );

    return [
        ...municipalList,
        ...countyList,
        ...countryList,
        ...sortedByLetterFirstLevelOccupationsList,
        ...secondLevelOccupationsList,
        ...publishedList,
        ...sectorList,
        ...engagementTypeList,
        ...extentList,
        ...educationList,
        ...workLanguageList,
        ...remoteList,
        ...occupationSuggestionList,
        ...needDriversLicenseList,
        ...experienceList,
    ];
}

// Ikke vis yrkeskategori hvis bruker har valgt et eller flere yrker i denne kategorien
export function filterOccupationFirstLevels(query: Query) {
    return query.occupationFirstLevels.filter((firstLevel) => {
        const found = query.occupationSecondLevels.find((obj) => obj.startsWith(`${firstLevel}.`));
        return !found;
    });
}

// Ikke vis fylke hvis bruker har valgt en eller flere kommuner i dette fylket
export function filterCounties(query: Query) {
    return query.counties.filter((county) => {
        const found = query.municipals.find((obj) => obj.startsWith(`${county}.`));
        return !found;
    });
}

export function getQueryOptions(queryObject: Query) {
    const searchTerm = queryObject.q && queryObject.q.trim();
    const searchTerms = searchTerm ? searchTerm.split(" ") : [];
    return [
        ...searchTerms,
        ...queryObject.municipals.map((municipals) => ({
            label: fixLocationName(municipals.split(".")[1]),
            value: `${MUNICIPAL}-${municipals}`,
        })),
        ...filterCounties(queryObject).map((c) => ({
            label: fixLocationName(c),
            value: `${COUNTY}-${c}`,
        })),
        ...queryObject.countries.map((countries) => ({
            label: fixLocationName(countries),
            value: `${COUNTRY}-${countries}`,
        })),
        ...(queryObject.international && queryObject.countries.length === 0
            ? [{ label: "Utland", value: `${INTERNATIONAL}-utland` }]
            : []),
        ...queryObject.occupationSecondLevels.map((occupation) => ({
            label: occupation.split(".")[1],
            value: `${OCCUPATION_SECOND_LEVEL}-${occupation}`,
        })),
        ...filterOccupationFirstLevels(queryObject).map((occupation) => ({
            label: occupation,
            value: `${OCCUPATION_FIRST_LEVEL}-${occupation}`,
        })),
        ...(queryObject.published
            ? [
                  {
                      label: PublishedLabelsEnum[queryObject.published],
                      value: `${PUBLISHED}-${queryObject.published}`,
                  },
              ]
            : []),
        ...queryObject.sector.map((item) =>
            item === "Ikke oppgitt"
                ? { label: "Sektor ikke oppgitt", value: `${SECTOR}-${item}` }
                : { label: item, value: `${SECTOR}-${item}` },
        ),
        ...queryObject.engagementType.map((item) =>
            editedItemKey(item) === "Ikke oppgitt"
                ? { label: "Ansettelsesform ikke oppgitt", value: `${ENGAGEMENT_TYPE}-${item}` }
                : { label: item, value: `${ENGAGEMENT_TYPE}-${item}` },
        ),
        ...queryObject.extent.map((item) => ({ label: item, value: `${EXTENT}-${item}` })),
        ...queryObject.education.map((item) =>
            item === "Ikke oppgitt"
                ? {
                      label: "Utdanning ikke oppgitt",
                      value: `${EDUCATION}-${item}`,
                  }
                : {
                      label: labelForEducation(item),
                      value: `${EDUCATION}-${item}`,
                  },
        ),
        ...queryObject.workLanguage.map((item) =>
            item === "Ikke oppgitt"
                ? { label: "Arbeidsspråk ikke oppgitt", value: `${WORK_LANGUAGE}-${item}` }
                : { label: item, value: `${WORK_LANGUAGE}-${item}` },
        ),
        ...queryObject.remote.map((item) =>
            item === "Ikke oppgitt"
                ? { label: "Hjemmekontor ikke oppgitt", value: `${REMOTE}-${item}` }
                : { label: item, value: `${REMOTE}-${item}` },
        ),
        ...queryObject.occupations.map((occupation) => ({
            label: occupation,
            value: `${OCCUPATION}-${occupation}`,
        })),
        ...queryObject.needDriversLicense.map((licence) =>
            licence === "Ikke oppgitt"
                ? { label: "Førerkort ikke oppgitt", value: `${NEED_DRIVERS_LICENSE}-${licence}` }
                : {
                      label: labelForNeedDriversLicense(licence),
                      value: `${NEED_DRIVERS_LICENSE}-${licence}`,
                  },
        ),
        ...queryObject.experience.map((experience) =>
            experience === "Ikke oppgitt"
                ? { label: "Erfaring ikke oppgitt", value: `${EXPERIENCE}-${experience}` }
                : {
                      label: labelForExperience(experience),
                      value: `${EXPERIENCE}-${experience}`,
                  },
        ),
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

interface Location {
    type: string;
    key: string;
    subLocations: Location[];
}

interface SuggestionList {
    label: string;
    value: string;
}

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
