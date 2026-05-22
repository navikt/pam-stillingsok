"use client";
import { MultiplyIcon } from "@navikt/aksel-icons";
import { Box, Button, HStack, Show, Stack } from "@navikt/ds-react";
import { useMemo } from "react";
import { useExperimentVariant } from "@/app/_experiments/client/ExperimentProvider";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { buildSelectedOptions } from "@/app/stillinger/(sok)/_components/searchBox/buildSelectedOptions";
import SaveSearchButton from "@/app/stillinger/lagrede-sok/_components/SaveSearchButton";

type SearchProps = {
    readonly tmpShowSaveAndResetButton: boolean;
    isFiltersVisible: boolean;
    setIsFiltersVisible: (isFiltersVisible: boolean) => void;
};

const TmpSearchButtons = ({ tmpShowSaveAndResetButton, isFiltersVisible, setIsFiltersVisible }: SearchProps) => {
    const tmpTestVariant = useExperimentVariant("qualifications_soek_superrask_cta");
    const tmpQuery = useQuery();
    const tmpUrlSearchParamsString = tmpQuery.urlSearchParams.toString();

    const tmpSelectedFiltersCount = useMemo(() => {
        const clone = new URLSearchParams(tmpUrlSearchParamsString);
        clone.delete("q");
        return buildSelectedOptions(clone).length;
    }, [tmpUrlSearchParamsString]);

    return (
        <Box
            paddingInline={{ xs: "space-16", md: "space-32" }}
            paddingBlock={{ xs: "space-16 space-16", md: "space-24 space-24" }}
            borderRadius={{ lg: "8" }}
            maxWidth={{ lg: "800px" }}
            className="search-container bg-brand-green-subtle mb-8"
        >
            {tmpTestVariant === "test" && (
                <Stack align="center" justify={{ xs: "space-between", lg: "end" }}>
                    <Show below="lg">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setIsFiltersVisible(!isFiltersVisible);
                            }}
                            aria-expanded={isFiltersVisible}
                            aria-label="Velg sted, yrke og andre filtre"
                            size="small"
                        >
                            {tmpSelectedFiltersCount > 0 ? `${tmpSelectedFiltersCount} filter` : "Velg filtre"}
                        </Button>
                    </Show>
                    {tmpShowSaveAndResetButton && (
                        <HStack gap="space-2" align="center" justify="end">
                            <Button
                                type="button"
                                variant="tertiary"
                                onClick={() => {
                                    tmpQuery.reset();
                                }}
                                icon={<MultiplyIcon aria-hidden="true" />}
                                size="small"
                            >
                                Tøm søk
                            </Button>
                            <SaveSearchButton size="small" />
                        </HStack>
                    )}
                </Stack>
            )}
        </Box>
    );
};

export default TmpSearchButtons;
