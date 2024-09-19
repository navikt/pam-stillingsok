import fixLocationName from "@/app/_common/utils/fixLocationName";
import { editedItemKey } from "@/app/(sok)/_components/filters/Engagement";
import { labelForEducation } from "@/app/(sok)/_components/filters/Education";
import { labelForNeedDriversLicense } from "@/app/(sok)/_components/filters/DriversLicense";
import { labelForExperience } from "@/app/(sok)/_components/filters/Experience";
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
    SEARCH_STRING,
    SECTOR,
    WORK_LANGUAGE,
} from "@/app/(sok)/_components/searchParamNames";
import { editedItemKey as editedOccupation } from "@/app/(sok)/_components/filters/Occupations";
import { PublishedLabels } from "@/app/(sok)/_utils/publishedLabels";

function buildOption(key: string, value: string): ComboboxOption | undefined {
    switch (key) {
        case SEARCH_STRING:
            return {
                label: value,
                value: value,
            };
        case COUNTY:
            return {
                label: fixLocationName(value),
                value: `${COUNTY}-${value}`,
            };
        case MUNICIPAL:
            return {
                label: fixLocationName(value.split(".")[1]),
                value: `${MUNICIPAL}-${value}`,
            };
        case COUNTRY:
            return {
                label: fixLocationName(value),
                value: `${COUNTRY}-${value}`,
            };
        case INTERNATIONAL:
            return { label: "Utland", value: `${INTERNATIONAL}-utland` };
        case OCCUPATION_SECOND_LEVEL:
            return {
                label: value.split(".")[1],
                value: `${OCCUPATION_SECOND_LEVEL}-${value}`,
            };
        case OCCUPATION_FIRST_LEVEL:
            return editedOccupation(value) === "Ikke oppgitt"
                ? { label: "Yrke ikke oppgitt", value: `${OCCUPATION_FIRST_LEVEL}-${value}` }
                : {
                      label: value,
                      value: `${OCCUPATION_FIRST_LEVEL}-${value}`,
                  };
        case PUBLISHED:
            return {
                label: PublishedLabels[value as keyof typeof PublishedLabels],
                value: `${PUBLISHED}-${value}`,
            };
        case SECTOR:
            return value === "Ikke oppgitt"
                ? { label: "Sektor ikke oppgitt", value: `${SECTOR}-${value}` }
                : { label: value, value: `${SECTOR}-${value}` };
        case ENGAGEMENT_TYPE:
            return editedItemKey(value) === "Ikke oppgitt"
                ? { label: "Ansettelsesform ikke oppgitt", value: `${ENGAGEMENT_TYPE}-${value}` }
                : { label: value, value: `${ENGAGEMENT_TYPE}-${value}` };
        case EXTENT:
            return value === "Ikke oppgitt"
                ? { label: "Omfang ikke oppgitt", value: `${EXTENT}-${value}` }
                : { label: value, value: `${EXTENT}-${value}` };
        case EDUCATION:
            return value === "Ikke oppgitt"
                ? {
                      label: "Utdanning ikke oppgitt",
                      value: `${EDUCATION}-${value}`,
                  }
                : {
                      label: labelForEducation(value),
                      value: `${EDUCATION}-${value}`,
                  };
        case WORK_LANGUAGE:
            return value === "Ikke oppgitt"
                ? { label: "Arbeidsspråk ikke oppgitt", value: `${WORK_LANGUAGE}-${value}` }
                : { label: value, value: `${WORK_LANGUAGE}-${value}` };
        case REMOTE:
            return value === "Ikke oppgitt"
                ? { label: "Hjemmekontor ikke oppgitt", value: `${REMOTE}-${value}` }
                : { label: value, value: `${REMOTE}-${value}` };
        case OCCUPATION:
            return {
                label: value,
                value: `${OCCUPATION}-${value}`,
            };
        case NEED_DRIVERS_LICENSE:
            return value === "Ikke oppgitt"
                ? { label: "Førerkort ikke oppgitt", value: `${NEED_DRIVERS_LICENSE}-${value}` }
                : {
                      label: labelForNeedDriversLicense(value),
                      value: `${NEED_DRIVERS_LICENSE}-${value}`,
                  };
        case EXPERIENCE:
            return value === "Ikke oppgitt"
                ? { label: "Erfaring ikke oppgitt", value: `${EXPERIENCE}-${value}` }
                : {
                      label: labelForExperience(value),
                      value: `${EXPERIENCE}-${value}`,
                  };
        default:
            return undefined;
    }
}

export function buildSelectedOptions(urlSearchParam: URLSearchParams): ComboboxOption[] {
    const countiesToSkip: string[] = [];
    const occupationLevel1ToSkip: string[] = [];
    let skipInternational: boolean = false;

    urlSearchParam.forEach((value: string, key: string) => {
        if (key === MUNICIPAL) {
            const county = value.split(".")[0];
            if (!countiesToSkip.includes(county)) {
                countiesToSkip.push(county);
            }
        }
        if (key === OCCUPATION_SECOND_LEVEL) {
            const level = value.split(".")[0];
            if (!occupationLevel1ToSkip.includes(level)) {
                occupationLevel1ToSkip.push(level);
            }
        }
        if (key === COUNTRY) {
            skipInternational = true;
        }
    });

    const options: ComboboxOption[] = [];
    urlSearchParam.forEach((value: string, key: string) => {
        const option = buildOption(key, value);
        const skip =
            (key === COUNTY && countiesToSkip.includes(value)) ||
            (key === OCCUPATION_FIRST_LEVEL && occupationLevel1ToSkip.includes(value)) ||
            (key === INTERNATIONAL && skipInternational);

        if (!skip) {
            if (option) {
                options.push(option);
            }
        }
    });
    return options;
}
