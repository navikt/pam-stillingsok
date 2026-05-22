"use client";
import { MultiplyIcon } from "@navikt/aksel-icons";
import { Box, Button, HStack, Show, Stack } from "@navikt/ds-react";
import FilterIcon from "@/app/_common/components/FilterIcon";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import SaveSearchButton from "@/app/stillinger/lagrede-sok/_components/SaveSearchButton";

type SearchProps = {
    readonly tmpShowSaveAndResetButton: boolean;
    isFiltersVisible: boolean;
    setIsFiltersVisible: (isFiltersVisible: boolean) => void;
};

const TmpSearchButtons = ({ tmpShowSaveAndResetButton, isFiltersVisible, setIsFiltersVisible }: SearchProps) => {
    const tmpQuery = useQuery();

    return (
        <Box
            paddingInline={{ xs: "space-16", md: "space-32" }}
            paddingBlock={{ xs: "space-16 space-16", md: "space-24 space-24" }}
            borderRadius={{ lg: "8" }}
            maxWidth={{ lg: "800px" }}
            className="search-container bg-brand-green-subtle mb-8"
        >
            <Stack align="center" justify={{ xs: "space-between", lg: "end" }}>
                <Show below="lg">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => {
                            setIsFiltersVisible(!isFiltersVisible);
                        }}
                        aria-expanded={isFiltersVisible}
                        aria-label="Velg sted, yrke og andre filtre"
                        size="small"
                        icon={<FilterIcon />}
                    >
                        Filter
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
        </Box>
    );
};

export default TmpSearchButtons;
