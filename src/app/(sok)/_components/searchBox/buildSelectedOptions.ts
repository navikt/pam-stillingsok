import fixLocationName from "@/app/_common/utils/fixLocationName";
import { PublishedLabelsEnum } from "@/app/(sok)/_utils/query";
import { editedItemKey } from "@/app/(sok)/_components/filters/Engagement";
import { labelForEducation } from "@/app/(sok)/_components/filters/Education";
import { labelForNeedDriversLicense } from "@/app/(sok)/_components/filters/DriversLicense";
import { labelForExperience } from "@/app/(sok)/_components/filters/Experience";
import { Query } from "@/app/(sok)/_components/searchBox/buildSearchBoxOptions";
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
    SECTOR,
    WORK_LANGUAGE,
} from "@/app/(sok)/_components/searchBox/filterTypes";

// Ikke vis yrkeskategori hvis bruker har valgt et eller flere yrker i denne kategorien
function filterOccupationFirstLevels(query: Query): string[] {
    return query.occupationFirstLevels.filter((firstLevel) => {
        const found = query.occupationSecondLevels.find((obj) => obj.startsWith(`${firstLevel}.`));
        return !found;
    });
}

// Ikke vis fylke hvis bruker har valgt en eller flere kommuner i dette fylket
function filterCounties(query: Query): string[] {
    return query.counties.filter((county) => {
        const found = query.municipals.find((obj) => obj.startsWith(`${county}.`));
        return !found;
    });
}

export function buildSelectedOptions(queryObject: Query): ComboboxOption[] {
    return [
        ...queryObject.q.map(
            (searchTerm): ComboboxOption => ({
                label: searchTerm,
                value: searchTerm,
            }),
        ),
        ...queryObject.municipals.map(
            (municipal): ComboboxOption => ({
                label: fixLocationName(municipal.split(".")[1]),
                value: `${MUNICIPAL}-${municipal}`,
            }),
        ),
        ...filterCounties(queryObject).map(
            (county): ComboboxOption => ({
                label: fixLocationName(county),
                value: `${COUNTY}-${county}`,
            }),
        ),
        ...queryObject.countries.map(
            (country): ComboboxOption => ({
                label: fixLocationName(country),
                value: `${COUNTRY}-${country}`,
            }),
        ),
        ...(queryObject.international && queryObject.countries.length === 0
            ? [{ label: "Utland", value: `${INTERNATIONAL}-utland` }]
            : []),
        ...queryObject.occupationSecondLevels.map(
            (occupation): ComboboxOption => ({
                label: occupation.split(".")[1],
                value: `${OCCUPATION_SECOND_LEVEL}-${occupation}`,
            }),
        ),
        ...filterOccupationFirstLevels(queryObject).map(
            (occupation): ComboboxOption => ({
                label: occupation,
                value: `${OCCUPATION_FIRST_LEVEL}-${occupation}`,
            }),
        ),
        ...(queryObject.published
            ? [
                  {
                      label: PublishedLabelsEnum[queryObject.published as keyof typeof PublishedLabelsEnum],
                      value: `${PUBLISHED}-${queryObject.published}`,
                  },
              ]
            : []),
        ...queryObject.sector.map(
            (sector): ComboboxOption =>
                sector === "Ikke oppgitt"
                    ? { label: "Sektor ikke oppgitt", value: `${SECTOR}-${sector}` }
                    : { label: sector, value: `${SECTOR}-${sector}` },
        ),
        ...queryObject.engagementType.map((engagement) =>
            editedItemKey(engagement) === "Ikke oppgitt"
                ? { label: "Ansettelsesform ikke oppgitt", value: `${ENGAGEMENT_TYPE}-${engagement}` }
                : { label: engagement, value: `${ENGAGEMENT_TYPE}-${engagement}` },
        ),
        ...(queryObject.extent.map((extent): ComboboxOption => ({ label: extent, value: `${EXTENT}-${extent}` })) ||
            []),
        ...queryObject.education.map(
            (education): ComboboxOption =>
                education === "Ikke oppgitt"
                    ? {
                          label: "Utdanning ikke oppgitt",
                          value: `${EDUCATION}-${education}`,
                      }
                    : {
                          label: labelForEducation(education),
                          value: `${EDUCATION}-${education}`,
                      },
        ),
        ...queryObject.workLanguage.map(
            (language): ComboboxOption =>
                language === "Ikke oppgitt"
                    ? { label: "Arbeidsspråk ikke oppgitt", value: `${WORK_LANGUAGE}-${language}` }
                    : { label: language, value: `${WORK_LANGUAGE}-${language}` },
        ),
        ...queryObject.remote.map(
            (remote): ComboboxOption =>
                remote === "Ikke oppgitt"
                    ? { label: "Hjemmekontor ikke oppgitt", value: `${REMOTE}-${remote}` }
                    : { label: remote, value: `${REMOTE}-${remote}` },
        ),
        ...queryObject.occupations.map(
            (occupation): ComboboxOption => ({
                label: occupation,
                value: `${OCCUPATION}-${occupation}`,
            }),
        ),
        ...queryObject.needDriversLicense.map(
            (driverLicense): ComboboxOption =>
                driverLicense === "Ikke oppgitt"
                    ? { label: "Førerkort ikke oppgitt", value: `${NEED_DRIVERS_LICENSE}-${driverLicense}` }
                    : {
                          label: labelForNeedDriversLicense(driverLicense),
                          value: `${NEED_DRIVERS_LICENSE}-${driverLicense}`,
                      },
        ),
        ...queryObject.experience.map(
            (experience): ComboboxOption =>
                experience === "Ikke oppgitt"
                    ? { label: "Erfaring ikke oppgitt", value: `${EXPERIENCE}-${experience}` }
                    : {
                          label: labelForExperience(experience),
                          value: `${EXPERIENCE}-${experience}`,
                      },
        ),
    ];
}
