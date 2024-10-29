export const QueryNames = {
    COUNTY: "county",
    COUNTRY: "country",
    DISTANCE: "distance",
    ENGAGEMENT_TYPE: "engagementType",
    EDUCATION: "education",
    EXPERIENCE: "experience",
    EXTENT: "extent",
    FROM: "from",
    INTERNATIONAL: "international",
    MUNICIPAL: "municipal",
    NEED_DRIVERS_LICENSE: "needDriversLicense",
    UNDER18: "under18",
    OCCUPATION: "occupation",
    OCCUPATION_FIRST_LEVEL: "occupationLevel1",
    OCCUPATION_SECOND_LEVEL: "occupationLevel2",
    PUBLISHED: "published",
    POSTCODE: "postcode",
    REMOTE: "remote",
    SEARCH_STRING: "q",
    SECTOR: "sector",
    SORT: "sort",
    URL_VERSION: "v",
    WORK_LANGUAGE: "workLanguage",
};

// IMPORTANT: Remember to add search param names that is related to search into AllowedSavedSearchParams.
// If not, they will not part of the search query for saved searches.
// FROM and SORT should not be part of saved search
export const AllowedSavedSearchParams = [
    QueryNames.COUNTY,
    QueryNames.COUNTRY,
    QueryNames.DISTANCE,
    QueryNames.ENGAGEMENT_TYPE,
    QueryNames.EDUCATION,
    QueryNames.EXPERIENCE,
    QueryNames.EXTENT,
    QueryNames.INTERNATIONAL,
    QueryNames.MUNICIPAL,
    QueryNames.NEED_DRIVERS_LICENSE,
    QueryNames.OCCUPATION,
    QueryNames.OCCUPATION_FIRST_LEVEL,
    QueryNames.OCCUPATION_SECOND_LEVEL,
    QueryNames.PUBLISHED,
    QueryNames.POSTCODE,
    QueryNames.REMOTE,
    QueryNames.SEARCH_STRING,
    QueryNames.SECTOR,
    QueryNames.URL_VERSION,
    QueryNames.WORK_LANGUAGE,
];
