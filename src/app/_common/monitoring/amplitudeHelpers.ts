import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
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
    [QueryNames.COUNTY]: {
        name: "Sted",
        level: "Fylke",
    },

    [QueryNames.COUNTRY]: {
        name: "Sted",
        level: "Land",
    },
    [QueryNames.ENGAGEMENT_TYPE]: {
        name: "Ansettelsesform",
    },
    [QueryNames.EDUCATION]: {
        name: "Utdanningsnivå",
    },
    [QueryNames.EXPERIENCE]: {
        name: "Erfaring",
    },
    [QueryNames.EXTENT]: {
        name: "Omfang",
    },
    [QueryNames.MUNICIPAL]: {
        name: "Sted",
        level: "Kommune",
    },
    [QueryNames.NEED_DRIVERS_LICENSE]: {
        name: "Førerkort",
    },
    [QueryNames.OCCUPATION]: {
        name: "Yrke",
    },
    [QueryNames.OCCUPATION_FIRST_LEVEL]: {
        name: "Yrkeskategori",
        level: "Yrkesnivå 1",
    },
    [QueryNames.OCCUPATION_SECOND_LEVEL]: {
        name: "Yrkeskategori",
        level: "Yrkesnivå 2",
    },
    [QueryNames.PUBLISHED]: {
        name: "Publisert",
    },
    [QueryNames.REMOTE]: {
        name: "Hjemmekontor",
    },
    [QueryNames.SECTOR]: {
        name: "Sektor",
    },
    [QueryNames.WORK_LANGUAGE]: {
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
