import {
    ADD_COUNTRY,
    ADD_COUNTY,
    ADD_EDUCATION,
    ADD_ENGAGEMENT_TYPE,
    ADD_EXTENT,
    ADD_MUNICIPAL,
    ADD_OCCUPATION_FIRST_LEVEL,
    ADD_OCCUPATION_SECOND_LEVEL,
    ADD_REMOTE,
    ADD_SECTOR,
    ADD_WORKLANGUAGE,
    REMOVE_COUNTRY,
    REMOVE_COUNTY,
    REMOVE_EDUCATION,
    REMOVE_ENGAGEMENT_TYPE,
    REMOVE_EXTENT,
    REMOVE_MUNICIPAL,
    REMOVE_OCCUPATION_FIRST_LEVEL,
    REMOVE_OCCUPATION_SECOND_LEVEL,
    REMOVE_REMOTE,
    REMOVE_SECTOR,
    REMOVE_WORKLANGUAGE,
    SET_INTERNATIONAL,
    SET_PUBLISHED,
} from "@/app/(sok)/_utils/queryReducer";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import { filterCounties, filterOccupationFirstLevels } from "@/app/(sok)/_components/utils/selectedFiltersUtils";
import { PublishedLabelsEnum } from "@/app/(sok)/_utils/query";
import { editedItemKey } from "@/app/(sok)/_components/filters/Engagement";

export const FilterEnum = {
    MUNICIPALS: "municipals",
    COUNTIES: "counties",
    COUNTRIES: "countries",
    INTERNATIONAL: "international",
    OCCUPATION_SECOND_LEVELS: "occupationSecondLevels",
    OCCUPATION_FIRST_LEVELS: "occupationFirstLevels",
    OCCUPATION: "occupation",
    PUBLISHED: "published",
    SECTOR: "sector",
    ENGAGEMENT_TYPE: "engagementType",
    EXTENT: "extent",
    EDUCATION: "education",
    WORK_LANGUAGE: "workLanguage",
    REMOTE: "remote",
};

export const filterAction = {
    [FilterEnum.MUNICIPALS]: { true: ADD_MUNICIPAL, false: REMOVE_MUNICIPAL },
    [FilterEnum.COUNTIES]: { true: ADD_COUNTY, false: REMOVE_COUNTY },
    [FilterEnum.INTERNATIONAL]: { true: SET_INTERNATIONAL, false: SET_INTERNATIONAL },
    [FilterEnum.COUNTRIES]: { true: ADD_COUNTRY, false: REMOVE_COUNTRY },
    [FilterEnum.OCCUPATION_FIRST_LEVELS]: {
        true: ADD_OCCUPATION_FIRST_LEVEL,
        false: REMOVE_OCCUPATION_FIRST_LEVEL,
    },
    [FilterEnum.OCCUPATION_SECOND_LEVELS]: {
        true: ADD_OCCUPATION_SECOND_LEVEL,
        false: REMOVE_OCCUPATION_SECOND_LEVEL,
    },
    [FilterEnum.PUBLISHED]: { true: SET_PUBLISHED, false: SET_PUBLISHED },
    [FilterEnum.ENGAGEMENT_TYPE]: { true: ADD_ENGAGEMENT_TYPE, false: REMOVE_ENGAGEMENT_TYPE },
    [FilterEnum.EXTENT]: { true: ADD_EXTENT, false: REMOVE_EXTENT },
    [FilterEnum.WORK_LANGUAGE]: { true: ADD_WORKLANGUAGE, false: REMOVE_WORKLANGUAGE },
    [FilterEnum.EDUCATION]: { true: ADD_EDUCATION, false: REMOVE_EDUCATION },
    [FilterEnum.REMOTE]: { true: ADD_REMOTE, false: REMOVE_REMOTE },
    [FilterEnum.SECTOR]: { true: ADD_SECTOR, false: REMOVE_SECTOR },
};

export function getQueryOptions(queryObject) {
    const searchTerm = queryObject.q && queryObject.q.trim();
    const searchTerms = searchTerm ? searchTerm.split(" ") : [];
    return [
        ...searchTerms,
        ...queryObject.municipals.map((municipals) => ({
            label: fixLocationName(municipals.split(".")[1]),
            value: `${FilterEnum.MUNICIPALS}-${municipals}`,
        })),
        ...filterCounties(queryObject).map((c) => ({
            label: fixLocationName(c),
            value: `${FilterEnum.COUNTIES}-${c}`,
        })),
        ...queryObject.countries.map((countries) => ({
            label: fixLocationName(countries),
            value: `${FilterEnum.COUNTRIES}-${countries}`,
        })),
        ...(queryObject.international && queryObject.countries.length === 0
            ? [{ label: "Utland", value: `${FilterEnum.INTERNATIONAL}-utland` }]
            : []),
        ...queryObject.occupationSecondLevels.map((occupation) => ({
            label: occupation.split(".")[1],
            value: `${FilterEnum.OCCUPATION_SECOND_LEVELS}-${occupation}`,
        })),
        ...filterOccupationFirstLevels(queryObject).map((occupation) => ({
            label: occupation,
            value: `${FilterEnum.OCCUPATION_FIRST_LEVELS}-${occupation}`,
        })),
        ...(queryObject.published
            ? [
                  {
                      label: PublishedLabelsEnum[queryObject.published],
                      value: `${FilterEnum.PUBLISHED}-${queryObject.published}`,
                  },
              ]
            : []),
        ...queryObject.sector.map((item) =>
            item === "Ikke oppgitt"
                ? { label: "Sektor ikke oppgitt", value: `${FilterEnum.SECTOR}-${item}` }
                : { label: item, value: `${FilterEnum.SECTOR}-${item}` },
        ),
        ...queryObject.engagementType.map((item) =>
            editedItemKey(item) === "Ikke oppgitt"
                ? { label: "Ansettelsesform ikke oppgitt", value: `${FilterEnum.ENGAGEMENT_TYPE}-${item}` }
                : { label: item, value: `${FilterEnum.ENGAGEMENT_TYPE}-${item}` },
        ),
        ...queryObject.extent.map((item) => ({ label: item, value: `${FilterEnum.EXTENT}-${item}` })),
        ...queryObject.education.map((item) => ({ label: item, value: `${FilterEnum.EDUCATION}-${item}` })),
        ...queryObject.workLanguage.map((item) =>
            item === "Ikke oppgitt"
                ? { label: "Arbeidsspråk ikke oppgitt", value: `${FilterEnum.WORK_LANGUAGE}-${item}` }
                : { label: item, value: `${FilterEnum.WORK_LANGUAGE}-${item}` },
        ),
        ...queryObject.remote.map((item) =>
            item === "Ikke oppgitt"
                ? { label: "Hjemmekontor ikke oppgitt", value: `${FilterEnum.REMOTE}-${item}` }
                : { label: item, value: `${FilterEnum.REMOTE}-${item}` },
        ),
    ];
}
