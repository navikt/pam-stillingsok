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

interface FilterEventData {
    name: string;
    level?: string;
    value?: string;
    checked?: boolean;
    source?: "Sidebar" | "Søkefelt";
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

export function formatFilterEventData(inputData: FilterEventData): FilterEventData {
    // Henter riktig 'name' og 'level' eks. "occupation" blir "Yrke".
    const data: FilterEventData = FILTER_NAME_MAPPING[inputData.name] ? FILTER_NAME_MAPPING[inputData.name] : inputData;

    // Konverterer eks. "now-3d" til "Nye siste 3 døgn"
    if (inputData.name === "Publisert" && inputData.value && PublishedLabels[inputData.value]) {
        data.value = PublishedLabels[inputData.value];
    }

    // Konverterer "Kultur og kreative yrker.Museum, bibliotek, arkiv" til "Museum, bibliotek, arkiv".
    if (data.level === "Yrkesnivå 2" && inputData.value) {
        // eslint-disable-next-line prefer-destructuring
        data.value = inputData.value.split(".")[1];
    }

    // Default source til "Sidebar"
    if (!inputData.source) {
        data.source = "Sidebar";
    }
    return data;
}
