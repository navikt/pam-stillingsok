import {
    COUNTRY,
    COUNTY,
    EDUCATION,
    ENGAGEMENT_TYPE,
    EXPERIENCE,
    EXTENT,
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
import { PublishedLabels } from "@/app/(sok)/_utils/publishedLabels";
import fixLocationName from "@/app/_common/utils/fixLocationName";

export enum FilterSource {
    SIDEBAR = "Sidebar",
    SEARCHBOX = "Søkefelt",
}

export interface FilterEventData {
    name: string;
    level?: string;
    value?: string;
    checked?: boolean;
    source?: FilterSource;
}

const FILTER_NAME_MAPPING: { [key: string]: FilterEventData } = {
    [COUNTY]: {
        name: "Sted",
        level: "Fylke",
    },

    [COUNTRY]: {
        name: "Sted",
        level: "Land",
    },
    [ENGAGEMENT_TYPE]: {
        name: "Ansettelsesform",
    },
    [EDUCATION]: {
        name: "Utdanningsnivå",
    },
    [EXPERIENCE]: {
        name: "Erfaring",
    },
    [EXTENT]: {
        name: "Omfang",
    },
    [MUNICIPAL]: {
        name: "Sted",
        level: "Kommune",
    },
    [NEED_DRIVERS_LICENSE]: {
        name: "Førerkort",
    },
    [OCCUPATION]: {
        name: "Yrke",
    },
    [OCCUPATION_FIRST_LEVEL]: {
        name: "Yrkeskategori",
        level: "Yrkesnivå 1",
    },
    [OCCUPATION_SECOND_LEVEL]: {
        name: "Yrkeskategori",
        level: "Yrkesnivå 2",
    },
    [PUBLISHED]: {
        name: "Publisert",
    },
    [REMOTE]: {
        name: "Hjemmekontor",
    },
    [SECTOR]: {
        name: "Sektor",
    },
    [WORK_LANGUAGE]: {
        name: "Arbeidsspråk",
    },
};

function getOccupationLevelTwoName(data: FilterEventData): string {
    if (data.level === "Yrkesnivå 2" && data.value) {
        return data.value.split(".")[1];
    }
    if (data.value) {
        return data.value;
    }
    return "";
}

export function formatFilterEventData(inputData: FilterEventData): FilterEventData {
    const data: FilterEventData = inputData;

    if (inputData.name in FILTER_NAME_MAPPING) {
        const { name, level } = FILTER_NAME_MAPPING[inputData.name];
        data.name = name;
        if (level) {
            data.level = level;
        }
    }

    if (inputData.name === "Sted") {
        data.value = fixLocationName(data.value, data.level === "Kommune");
    }

    if (data.name === "Publisert" && data.value && PublishedLabels[data.value]) {
        data.value = PublishedLabels[data.value];
    }

    if (data.level === "Yrkesnivå 2") {
        data.value = getOccupationLevelTwoName(data);
    }

    if (!inputData.source) {
        data.source = FilterSource.SIDEBAR;
    }
    return data;
}
