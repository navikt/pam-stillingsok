export const COUNTY = "county";
export const COUNTRY = "country";
export const DISTANCE = "distance";
export const ENGAGEMENT_TYPE = "engagementType";
export const EDUCATION = "education";
export const EXPERIENCE = "experience";
export const EXTENT = "extent";
export const FROM = "from";
export const INTERNATIONAL = "international";
export const MUNICIPAL = "municipal";
export const NEED_DRIVERS_LICENSE = "needDriversLicense";
export const OCCUPATION = "occupation";
export const OCCUPATION_FIRST_LEVEL = "occupationLevel1";
export const OCCUPATION_SECOND_LEVEL = "occupationLevel2";
export const PUBLISHED = "published";
export const POSTCODE = "postcode";
export const REMOTE = "remote";
export const SEARCH_STRING = "q";
export const SECTOR = "sector";
export const SIZE = "size";
export const SORT = "sort";
export const VERSION = "v";
export const WORK_LANGUAGE = "workLanguage";

// IMPORTANT: Remember to add search param names that is related to search into AllowedSavedSearchParams.
// If not, they will not part of the search query for saved searches.
// FROM, SIZE and SORT should not be part of saved search
export const AllowedSavedSearchParams = [
    COUNTY,
    COUNTRY,
    DISTANCE,
    ENGAGEMENT_TYPE,
    EDUCATION,
    EXPERIENCE,
    EXTENT,
    INTERNATIONAL,
    MUNICIPAL,
    NEED_DRIVERS_LICENSE,
    OCCUPATION,
    OCCUPATION_FIRST_LEVEL,
    OCCUPATION_SECOND_LEVEL,
    PUBLISHED,
    POSTCODE,
    REMOTE,
    SEARCH_STRING,
    SECTOR,
    VERSION,
    WORK_LANGUAGE,
];
