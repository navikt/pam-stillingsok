import {
    createSavedSearchParamsWithoutVersion,
    searchParamsSize,
} from "@/app/stillinger/(sok)/_components/searchBox/searchParamsUtils";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import SaveSearchButton from "@/app/stillinger/lagrede-sok/_components/SaveSearchButton";

type SearchBoxSaveSearchButtonProps = {
    readonly searchParams: URLSearchParams;
};

function SearchBoxSaveSearchButton({ searchParams }: SearchBoxSaveSearchButtonProps) {
    const savedSearchParamsWithoutVersion = createSavedSearchParamsWithoutVersion(searchParams);

    const onlyDrivingDistanceFiltersActive =
        searchParamsSize(savedSearchParamsWithoutVersion) === 2 &&
        savedSearchParamsWithoutVersion.has(QueryNames.POSTCODE) &&
        savedSearchParamsWithoutVersion.has(QueryNames.DISTANCE);

    const showSaveButton = searchParamsSize(savedSearchParamsWithoutVersion) > 0 && !onlyDrivingDistanceFiltersActive;

    if (!showSaveButton) {
        return null;
    }

    return <SaveSearchButton size="xsmall" />;
}

export default SearchBoxSaveSearchButton;
