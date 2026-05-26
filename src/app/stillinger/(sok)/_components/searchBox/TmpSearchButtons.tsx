"use client";
import { MultiplyIcon, TrashIcon } from "@navikt/aksel-icons";
import { Box, Button, Chips, Hide, HStack, Show, Tag } from "@navikt/ds-react";
import { ChipsRemovable } from "@navikt/ds-react/Chips";
import { useMemo } from "react";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { buildSelectedOptions } from "@/app/stillinger/(sok)/_components/searchBox/buildSelectedOptions";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import SaveSearchButton from "@/app/stillinger/lagrede-sok/_components/SaveSearchButton";

type SearchProps = {
    readonly tmpShowSaveAndResetButton: boolean;
    isFiltersVisible: boolean;
    setIsFiltersVisible: (isFiltersVisible: boolean) => void;
};

const TmpSearchButtons = ({ tmpShowSaveAndResetButton, isFiltersVisible, setIsFiltersVisible }: SearchProps) => {
    const tmpQuery = useQuery();
    const tmpUrlSearchParamsString = tmpQuery.urlSearchParams.toString();

    const tmpSelectedOptions = useMemo(() => {
        const urlSearchParams = new URLSearchParams(tmpUrlSearchParamsString);
        urlSearchParams.delete(QueryNames.SEARCH_STRING);
        return buildSelectedOptions(urlSearchParams);
    }, [tmpUrlSearchParamsString]);

    function isKnownQueryName(potentialKey: string): boolean {
        return (Object.values(QueryNames) as string[]).includes(potentialKey);
    }

    function parseOption(option: string): Readonly<{
        key?: string;
        value: string;
    }> {
        const dashIndex = option.indexOf("-");
        if (dashIndex === -1) {
            return {
                value: option,
            };
        }
        const potentialKey = option.slice(0, dashIndex);
        if (isKnownQueryName(potentialKey)) {
            return {
                key: potentialKey,
                value: option.slice(dashIndex + 1),
            };
        }
        return {
            key: potentialKey,
            value: option,
        };
    }

    const handleFilterRemoval = (option: string) => {
        const parsedOption = parseOption(option);
        const key = parsedOption.key;
        const value = parsedOption.value;

        if (key) {
            tmpQuery.update(
                (draft) => {
                    if (key === QueryNames.INTERNATIONAL) {
                        draft.delete(QueryNames.INTERNATIONAL);
                        return;
                    }

                    if (key === QueryNames.MUNICIPAL) {
                        draft.delete(QueryNames.MUNICIPAL, value);

                        const county = value.split(".")[0];
                        const remainingMunicipalsInCounty = draft.getAll(QueryNames.MUNICIPAL).filter((municipal) => {
                            return municipal.startsWith(`${county}.`);
                        });

                        if (remainingMunicipalsInCounty.length === 0) {
                            draft.delete(QueryNames.COUNTY, county);
                        }

                        return;
                    }

                    if (key === QueryNames.COUNTRY) {
                        draft.delete(QueryNames.COUNTRY, value);

                        const remainingCountries = draft.getAll(QueryNames.COUNTRY);

                        if (remainingCountries.length === 0) {
                            draft.delete(QueryNames.INTERNATIONAL);
                        }

                        return;
                    }

                    if (key === QueryNames.OCCUPATION_SECOND_LEVEL) {
                        draft.delete(QueryNames.OCCUPATION_SECOND_LEVEL, value);

                        const firstLevel = value.split(".")[0];
                        const remainingOccupationsInCategory = draft
                            .getAll(QueryNames.OCCUPATION_SECOND_LEVEL)
                            .filter((secondLevel) => {
                                return secondLevel.startsWith(`${firstLevel}.`);
                            });

                        if (remainingOccupationsInCategory.length === 0) {
                            draft.delete(QueryNames.OCCUPATION_FIRST_LEVEL, firstLevel);
                        }

                        return;
                    }

                    draft.delete(key, value);
                },
                {
                    changedKey: key,
                },
            );
        }
    };

    const SLICE_AFTER = 15;

    return (
        <Box
            paddingInline={{ xs: "space-16", lg: "space-32" }}
            paddingBlock={{ xs: "space-16 space-16", md: "space-16 space-24" }}
            borderRadius={{ lg: "8" }}
            maxWidth={{ lg: "800px" }}
            className="search-container bg-brand-green-subtle mb-8"
        >
            <Show below="lg">
                <HStack align="center" justify="space-between" gap="space-4" className="mb-2">
                    <Button
                        size="small"
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            setIsFiltersVisible(!isFiltersVisible);
                        }}
                        aria-expanded={isFiltersVisible}
                        aria-label="Velg sted, yrke og andre filtre"
                    >
                        Filter
                    </Button>

                    {tmpShowSaveAndResetButton && (
                        <HStack gap="space-4">
                            <Button
                                type="button"
                                variant="tertiary"
                                onClick={() => {
                                    tmpQuery.reset();
                                }}
                                icon={<MultiplyIcon aria-hidden="true" />}
                                size="small"
                            >
                                Nullstill
                            </Button>
                            <SaveSearchButton size="small" />
                        </HStack>
                    )}
                </HStack>
            </Show>
            <HStack>
                <div>
                    <Chips>
                        {tmpSelectedOptions.slice(0, SLICE_AFTER).map((it) => (
                            <ChipsRemovable
                                key={it.value}
                                data-color="accent"
                                onClick={() => {
                                    handleFilterRemoval(it.value);
                                }}
                            >
                                {it.label}
                            </ChipsRemovable>
                        ))}

                        {tmpSelectedOptions.length > SLICE_AFTER && (
                            <Tag variant="moderate">{`+${tmpSelectedOptions.length - SLICE_AFTER} til`}</Tag>
                        )}
                    </Chips>
                </div>
            </HStack>

            {tmpShowSaveAndResetButton && (
                <Hide below="lg" className="mt-4">
                    <HStack justify="start">
                        <Button
                            type="button"
                            variant="tertiary"
                            onClick={() => {
                                tmpQuery.reset();
                            }}
                            icon={<TrashIcon aria-hidden="true" />}
                            size="small"
                        >
                            Nullstill søk
                        </Button>
                        <SaveSearchButton size="small" />
                    </HStack>
                </Hide>
            )}
        </Box>
    );
};

export default TmpSearchButtons;
