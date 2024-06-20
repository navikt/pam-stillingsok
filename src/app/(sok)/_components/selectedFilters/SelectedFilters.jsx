/* eslint-disable react/no-array-index-key */
import React, { useState } from "react";
import { Button, Chips, HStack } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import { editedItemKey } from "@/app/(sok)/_components/filters/Engagement";
import { labelForEducation } from "@/app/(sok)/_components/filters/Education";
import { labelForNeedDriversLicense } from "@/app/(sok)/_components/filters/DriversLicense";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import SaveSearchButton from "@/app/lagrede-sok/_components/SaveSearchButton";
import { PublishedLabelsEnum } from "@/app/(sok)/_components/filters/Published";
import { useSearchParams } from "next/navigation";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";
import useSearchRouter from "@/app/(sok)/_utils/useSearchRouter";

function SelectedFilters() {
    const MAX_CHIPS = 10;
    const [showAll, setShowAll] = useState(false);
    const searchParams = useSearchParams();
    const router = useSearchRouter();

    const removeMunicipal = (value) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(SearchQueryParams.MUNICIPAL, value);

        // Hvis dette var den siste valgte kommune i samme fylke, så skal fylket også fjernes
        const county = value.split(".")[0];
        const remainingMunicipalsInCounty = newSearchParams
            .getAll(SearchQueryParams.MUNICIPAL)
            .filter((municipal) => municipal.startsWith(`${county}.`));
        if (remainingMunicipalsInCounty.length === 0) {
            newSearchParams.delete(SearchQueryParams.COUNTY, county);
        }
        router.replace(newSearchParams, { scroll: false });
    };

    const removeCountry = (value) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(SearchQueryParams.COUNTRY, value);

        // Hvis dette var den siste landet, så skal "Utland" også fjernes
        if (newSearchParams.getAll(SearchQueryParams.COUNTRY).length === 1) {
            newSearchParams.delete(SearchQueryParams.INTERNATIONAL);
        }
        router.replace(newSearchParams, { scroll: false });
    };

    const removeOccupation = (value) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(SearchQueryParams.OCCUPATION_LEVEL_2, value);

        // Hvis dette var det siste yrket i samme yrkeskategori, så skal yrkeskategorien også fjernes
        const firstLevel = value.split(".")[0];
        const remainingOccupationsInCategory = newSearchParams
            .getAll(SearchQueryParams.OCCUPATION_LEVEL_2)
            .filter((secondLevel) => secondLevel.startsWith(`${firstLevel}.`));
        if (remainingOccupationsInCategory.length === 0) {
            newSearchParams.delete(SearchQueryParams.OCCUPATION_LEVEL_1, firstLevel);
        }
        router.replace(newSearchParams, { scroll: false });
    };

    const removeSearchString = () => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(SearchQueryParams.SORT);
        newSearchParams.delete(SearchQueryParams.OCCUPATION);
        newSearchParams.delete(SearchQueryParams.Q);
        router.replace(newSearchParams, { scroll: false });
    };

    const remove = (name, value) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(name, value);
        router.replace(newSearchParams, { scroll: false });
    };

    const clear = () => {
        const newSearchParams = new URLSearchParams();
        router.replace(newSearchParams, { scroll: false });
    };

    const chips = [];

    searchParams.forEach((value, name) => {
        if (name === SearchQueryParams.Q) {
            chips.push(
                <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={removeSearchString}>
                    {searchParams.get(SearchQueryParams.Q)}
                </Chips.Removable>,
            );
        }
        if (name === SearchQueryParams.OCCUPATION) {
            chips.push(
                <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => remove(name, value)}>
                    {value}
                </Chips.Removable>,
            );
        }
        if (name === SearchQueryParams.COUNTY) {
            // Ikke vis fylke hvis bruker har valgt et eller flere kommuner i dette fylket
            const found = searchParams.getAll(SearchQueryParams.MUNICIPAL).find((obj) => obj.startsWith(`${value}.`));
            if (!found) {
                chips.push(
                    <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => remove(name, value)}>
                        {fixLocationName(value)}
                    </Chips.Removable>,
                );
            }
        }
        if (name === SearchQueryParams.MUNICIPAL) {
            chips.push(
                <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => removeMunicipal(value)}>
                    {fixLocationName(value.split(".")[1])}
                </Chips.Removable>,
            );
        }
        if (name === SearchQueryParams.INTERNATIONAL) {
            if (!searchParams.has(SearchQueryParams.COUNTRY)) {
                chips.push(
                    <Chips.Removable
                        variant="neutral"
                        key="utland-filter"
                        onClick={() => {
                            remove(SearchQueryParams.INTERNATIONAL);
                        }}
                    >
                        Utland
                    </Chips.Removable>,
                );
            }
        }
        if (name === SearchQueryParams.COUNTRY) {
            chips.push(
                <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => removeCountry(value)}>
                    {fixLocationName(value)}
                </Chips.Removable>,
            );
        }
        if (name === SearchQueryParams.OCCUPATION_LEVEL_1) {
            // Ikke vis yrkeskategori hvis bruker har valgt et eller flere yrker i denne kategorien
            const found = searchParams
                .getAll(SearchQueryParams.OCCUPATION_LEVEL_2)
                .find((obj) => obj.startsWith(`${value}.`));
            if (!found) {
                chips.push(
                    <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => remove(name, value)}>
                        {value}
                    </Chips.Removable>,
                );
            }
        }
        if (name === SearchQueryParams.OCCUPATION_LEVEL_2) {
            chips.push(
                <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => removeOccupation(value)}>
                    {value.split(".")[1]}
                </Chips.Removable>,
            );
        }
        if (name === SearchQueryParams.PUBLISHED) {
            chips.push(
                <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => remove(name)}>
                    {PublishedLabelsEnum[value]}
                </Chips.Removable>,
            );
        }
        if (name === SearchQueryParams.SECTOR) {
            chips.push(
                <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => remove(name, value)}>
                    {value === "Ikke oppgitt" ? "Sektor ikke oppgitt" : value}
                </Chips.Removable>,
            );
        }
        if (name === SearchQueryParams.ENGAGEMENT_TYPE) {
            chips.push(
                <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => remove(name, value)}>
                    {editedItemKey(value) === "Ikke oppgitt" ? "Ansettelsesform ikke oppgitt" : value}
                </Chips.Removable>,
            );
        }
        if (name === SearchQueryParams.EXTENT) {
            chips.push(
                <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => remove(name, value)}>
                    {value}
                </Chips.Removable>,
            );
        }
        if (name === SearchQueryParams.WORK_LANGUAGE) {
            chips.push(
                <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => remove(name, value)}>
                    {value === "Ikke oppgitt" ? "Arbeidsspråk ikke oppgitt" : value}
                </Chips.Removable>,
            );
        }
        if (name === SearchQueryParams.EDUCATION) {
            const labelForEducationValue = labelForEducation(value);
            chips.push(
                <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => remove(name, value)}>
                    {labelForEducationValue === "Ikke oppgitt" ? "Utdanning ikke oppgitt" : labelForEducationValue}
                </Chips.Removable>,
            );
        }
        if (name === SearchQueryParams.NEED_DRIVERS_LICENSE) {
            const labelForNeedDriversLicenseValue = labelForNeedDriversLicense(value);
            chips.push(
                <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => remove(name, value)}>
                    {labelForNeedDriversLicenseValue === "Ikke oppgitt"
                        ? "Førerkort ikke oppgitt"
                        : labelForNeedDriversLicenseValue}
                </Chips.Removable>,
            );
        }
        if (name === SearchQueryParams.REMOTE) {
            chips.push(
                <Chips.Removable variant="neutral" key={`${name}-${value}`} onClick={() => remove(name, value)}>
                    {value === "Ikke oppgitt" ? "Hjemmekontor ikke oppgitt" : value}
                </Chips.Removable>,
            );
        }
    });

    if (chips.length === 0) {
        return null;
    }

    return (
        <HStack gap="2" align="center">
            {chips.length > MAX_CHIPS ? (
                <>
                    {showAll ? (
                        <Chips aria-label="Liste med valgte søkefiltre">{chips}</Chips>
                    ) : (
                        <Chips aria-label="Liste med valgte søkefiltre">{chips.slice(0, MAX_CHIPS)}</Chips>
                    )}
                    {!showAll && (
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                                setShowAll(!showAll);
                            }}
                        >
                            {`Vis ${chips.length - MAX_CHIPS} til`}
                        </Button>
                    )}
                </>
            ) : (
                <Chips aria-label="Liste med valgte søkefiltre">{chips}</Chips>
            )}
            <Button
                type="button"
                variant="tertiary"
                onClick={() => {
                    clear();
                }}
                icon={<TrashIcon aria-hidden="true" />}
            >
                Fjern alle
            </Button>
            <SaveSearchButton />
        </HStack>
    );
}

export default SelectedFilters;
