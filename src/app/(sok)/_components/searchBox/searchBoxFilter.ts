import {
    COUNTRY,
    COUNTY,
    EDUCATION,
    ENGAGEMENT_TYPE,
    EXTENT,
    MUNICIPAL,
    NEED_DRIVERS_LICENSE,
    OCCUPATION,
    OCCUPATION_FIRST_LEVEL,
    OCCUPATION_SECOND_LEVEL,
    SECTOR,
    WORK_LANGUAGE,
} from "@/app/(sok)/_components/searchParamNames";

export const findLabelForFilter = (value: string): string => {
    switch (value) {
        case MUNICIPAL:
            return "(Kommune)";
        case COUNTY:
            return "(Fylke)";
        case COUNTRY:
            return "(Land)";
        case OCCUPATION_FIRST_LEVEL:
            return "(Yrkesgruppe nivå 1)";
        case OCCUPATION_SECOND_LEVEL:
            return "(Yrkesgruppe nivå 2)";
        case OCCUPATION:
            return "(Yrke)";
        case SECTOR:
            return "(Sektor)";
        case ENGAGEMENT_TYPE:
            return "(Ansettelsesform)";
        case EXTENT:
            return "(Omfang)";
        case EDUCATION:
            return "(Utdanning)";
        case WORK_LANGUAGE:
            return "(Arbeidsspråk)";
        case NEED_DRIVERS_LICENSE:
            return "(Førerkort)";
        default:
            return "";
    }
};
