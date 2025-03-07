import fixLocationName from "@/app/stillinger/_common/utils/fixLocationName";
import { editedItemKey } from "@/app/stillinger/_components/filters/Engagement";
import { labelForEducation } from "@/app/stillinger/_components/filters/Education";
import { labelForNeedDriversLicense } from "@/app/stillinger/_components/filters/DriversLicense";
import { labelForExperience } from "@/app/stillinger/_components/filters/Experience";
import { ComboboxOption } from "@navikt/ds-react/cjs/form/combobox/types";
import { QueryNames } from "@/app/stillinger/_utils/QueryNames";
import { editedItemKey as editedOccupation } from "@/app/stillinger/_components/filters/Occupations";
import { PublishedLabels } from "@/app/stillinger/_utils/publishedLabels";
import { labelForUnder18 } from "@/app/stillinger/_components/filters/Under18";

function buildOption(key: string, value: string): ComboboxOption | undefined {
    switch (key) {
        case QueryNames.SEARCH_STRING:
            return {
                label: value,
                value: value,
            };
        case QueryNames.COUNTY:
            return {
                label: fixLocationName(value),
                value: `${QueryNames.COUNTY}-${value}`,
            };
        case QueryNames.MUNICIPAL:
            return {
                label: fixLocationName(value.split(".")[1]),
                value: `${QueryNames.MUNICIPAL}-${value}`,
            };
        case QueryNames.COUNTRY:
            return {
                label: fixLocationName(value),
                value: `${QueryNames.COUNTRY}-${value}`,
            };
        case QueryNames.INTERNATIONAL:
            return { label: "Utland", value: `${QueryNames.INTERNATIONAL}-utland` };
        case QueryNames.OCCUPATION_SECOND_LEVEL:
            return {
                label: value.split(".")[1],
                value: `${QueryNames.OCCUPATION_SECOND_LEVEL}-${value}`,
            };
        case QueryNames.OCCUPATION_FIRST_LEVEL:
            return editedOccupation(value) === "Ikke oppgitt"
                ? { label: "Yrke ikke oppgitt", value: `${QueryNames.OCCUPATION_FIRST_LEVEL}-${value}` }
                : {
                      label: value,
                      value: `${QueryNames.OCCUPATION_FIRST_LEVEL}-${value}`,
                  };
        case QueryNames.PUBLISHED:
            return {
                label: PublishedLabels[value as keyof typeof PublishedLabels],
                value: `${QueryNames.PUBLISHED}-${value}`,
            };
        case QueryNames.SECTOR:
            return value === "Ikke oppgitt"
                ? { label: "Sektor ikke oppgitt", value: `${QueryNames.SECTOR}-${value}` }
                : { label: value, value: `${QueryNames.SECTOR}-${value}` };
        case QueryNames.ENGAGEMENT_TYPE:
            return editedItemKey(value) === "Ikke oppgitt"
                ? { label: "Ansettelsesform ikke oppgitt", value: `${QueryNames.ENGAGEMENT_TYPE}-${value}` }
                : { label: value, value: `${QueryNames.ENGAGEMENT_TYPE}-${value}` };
        case QueryNames.EXTENT:
            return value === "Ikke oppgitt"
                ? { label: "Omfang ikke oppgitt", value: `${QueryNames.EXTENT}-${value}` }
                : { label: value, value: `${QueryNames.EXTENT}-${value}` };
        case QueryNames.EDUCATION:
            return value === "Ikke oppgitt"
                ? {
                      label: "Utdanning ikke oppgitt",
                      value: `${QueryNames.EDUCATION}-${value}`,
                  }
                : {
                      label: labelForEducation(value),
                      value: `${QueryNames.EDUCATION}-${value}`,
                  };
        case QueryNames.WORK_LANGUAGE:
            return value === "Ikke oppgitt"
                ? { label: "Arbeidsspråk ikke oppgitt", value: `${QueryNames.WORK_LANGUAGE}-${value}` }
                : { label: value, value: `${QueryNames.WORK_LANGUAGE}-${value}` };
        case QueryNames.REMOTE:
            return value === "Ikke oppgitt"
                ? { label: "Hjemmekontor ikke oppgitt", value: `${QueryNames.REMOTE}-${value}` }
                : { label: value, value: `${QueryNames.REMOTE}-${value}` };
        case QueryNames.OCCUPATION:
            return {
                label: value,
                value: `${QueryNames.OCCUPATION}-${value}`,
            };
        case QueryNames.NEED_DRIVERS_LICENSE:
            return value === "Ikke oppgitt"
                ? { label: "Førerkort ikke oppgitt", value: `${QueryNames.NEED_DRIVERS_LICENSE}-${value}` }
                : {
                      label: labelForNeedDriversLicense(value),
                      value: `${QueryNames.NEED_DRIVERS_LICENSE}-${value}`,
                  };
        case QueryNames.UNDER18:
            return value === "Ikke oppgitt"
                ? { label: "Under 18 ikke oppgitt", value: `${QueryNames.UNDER18}-${value}` }
                : {
                      label: labelForUnder18(value),
                      value: `${QueryNames.UNDER18}-${value}`,
                  };
        case QueryNames.EXPERIENCE:
            return value === "Ikke oppgitt"
                ? { label: "Erfaring ikke oppgitt", value: `${QueryNames.EXPERIENCE}-${value}` }
                : {
                      label: labelForExperience(value),
                      value: `${QueryNames.EXPERIENCE}-${value}`,
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
        if (key === QueryNames.MUNICIPAL) {
            const county = value.split(".")[0];
            if (!countiesToSkip.includes(county)) {
                countiesToSkip.push(county);
            }
        }
        if (key === QueryNames.OCCUPATION_SECOND_LEVEL) {
            const level = value.split(".")[0];
            if (!occupationLevel1ToSkip.includes(level)) {
                occupationLevel1ToSkip.push(level);
            }
        }
        if (key === QueryNames.COUNTRY) {
            skipInternational = true;
        }
    });

    const options: ComboboxOption[] = [];
    urlSearchParam.forEach((value: string, key: string) => {
        const option = buildOption(key, value);
        const skip =
            (key === QueryNames.COUNTY && countiesToSkip.includes(value)) ||
            (key === QueryNames.OCCUPATION_FIRST_LEVEL && occupationLevel1ToSkip.includes(value)) ||
            (key === QueryNames.INTERNATIONAL && skipInternational);

        if (!skip) {
            if (option) {
                options.push(option);
            }
        }
    });
    return options;
}
