import fixLocationName from "@/app/_common/utils/fixLocationName";
import { PublishedLabelsEnum } from "@/app/(sok)/_utils/query";
import { editedItemKey } from "@/app/(sok)/_components/filters/Engagement";
import { labelForEducation } from "@/app/(sok)/_components/filters/Education";
import { labelForNeedDriversLicense } from "@/app/(sok)/_components/filters/DriversLicense";
import { labelForExperience } from "@/app/(sok)/_components/filters/Experience";
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
    Query,
    REMOTE,
    SECTOR,
    WORK_LANGUAGE,
} from "@/app/(sok)/_components/searchBox/searchBoxOption";

// Ikke vis yrkeskategori hvis bruker har valgt et eller flere yrker i denne kategorien
function filterOccupationFirstLevels(query: Query) {
    return query.occupationFirstLevels.filter((firstLevel) => {
        const found = query.occupationSecondLevels.find((obj) => obj.startsWith(`${firstLevel}.`));
        return !found;
    });
}

// Ikke vis fylke hvis bruker har valgt en eller flere kommuner i dette fylket
function filterCounties(query: Query) {
    return query.counties.filter((county) => {
        const found = query.municipals.find((obj) => obj.startsWith(`${county}.`));
        return !found;
    });
}

export function getQuerySelectedOptions(queryObject: Query) {
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
