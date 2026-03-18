import React from "react";
import { HStack } from "@navikt/ds-react";
import SaveSearchButton from "@/app/stillinger/lagrede-sok/_components/SaveSearchButton";
import ResetSearchButton from "@/app/stillinger/(sok)/_components/searchBox/ResetSearchButton";
import {
    createSavedSearchParamsWithoutVersion,
    searchParamsSize,
} from "@/app/stillinger/(sok)/_components/searchBox/searchParamsUtils";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

type SaveAndResetButtonProps = {
    readonly searchParams: URLSearchParams;
};

function SaveAndResetButton({ searchParams }: SaveAndResetButtonProps) {
    const savedSearchParamsWithoutVersion = createSavedSearchParamsWithoutVersion(searchParams);

    const onlyDrivingDistanceFiltersActive =
        searchParamsSize(savedSearchParamsWithoutVersion) === 2 &&
        savedSearchParamsWithoutVersion.has(QueryNames.POSTCODE) &&
        savedSearchParamsWithoutVersion.has(QueryNames.DISTANCE);

    const showSaveAndResetButton =
        searchParamsSize(savedSearchParamsWithoutVersion) > 0 && !onlyDrivingDistanceFiltersActive;

    if (!showSaveAndResetButton) {
        return null;
    }

    return (
        <HStack gap="space-8" align="center" justify="end">
            <SaveSearchButton size="small" savedSearchParamsWithoutVersion={savedSearchParamsWithoutVersion} />
            <ResetSearchButton />
        </HStack>
    );
}

export default SaveAndResetButton;
