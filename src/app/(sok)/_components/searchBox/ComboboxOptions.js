import { editedItemKey } from "@/app/(sok)/_components/filters/Engagement";
import sortValuesByFirstLetter from "@/app/(sok)/_components/utils/sortValuesByFirstLetter";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import buildLocations from "@/app/(sok)/_components/utils/buildLocations";
import PropTypes from "prop-types";
import { FilterEnum } from "@/app/(sok)/_components/searchBox/optionUtils";

function ComboboxOptions({ aggregations, locations, allSuggestions }) {
    // TODO: add sidebar filters to combobox options
    // TODO: checking off municipal, doesn't mark county, same for Utland, country
    const locationList = buildLocations(aggregations, locations);

    const municipalList = locationList
        .map((location) => location.subLocations)
        .flat()
        .filter((subLocation) => subLocation.type === "municipal")
        .map((municipal) => ({
            label: fixLocationName(municipal.key.split(".")[1]),
            value: `${FilterEnum.MUNICIPALS}-${municipal.key}`,
        }));

    const countyList = locationList
        .filter((location) => location.type === "county")
        .map((county) => ({
            label: fixLocationName(county.key),
            value: `${FilterEnum.COUNTIES}-${county.key}`,
        }));

    const countryList = locationList
        .filter((location) => location.type === "international")
        .map((location) => location.subLocations)
        .flat()
        .map((country) => ({
            label: fixLocationName(country.key),
            value: `${FilterEnum.COUNTRIES}-${country.key}`,
        }));

    const withSortedSecondLevelOccupations = aggregations.occupationFirstLevels.map((item) => {
        const secondLevel = sortValuesByFirstLetter(item.occupationSecondLevels);
        return {
            secondLevel,
            ...item,
        };
    });
    const sortedByLetterFirstLevelOccupationsList = sortValuesByFirstLetter(withSortedSecondLevelOccupations).map(
        (occupation) => ({
            label: occupation.key,
            value: `${FilterEnum.OCCUPATION_FIRST_LEVELS}-${occupation.key}`,
        }),
    );
    // secondlevel occupations

    // published
    // sector
    const sectorList = aggregations.sector.map((item) =>
        item.key === "Ikke oppgitt"
            ? { label: "Sektor ikke oppgitt", value: `${FilterEnum.SECTOR}-${item.key}` }
            : { label: item.key, value: `${FilterEnum.SECTOR}-${item.key}` },
    );

    const engagementTypeList = aggregations.engagementTypes.map((item) =>
        editedItemKey(item.key) === "Ikke oppgitt"
            ? { label: "Ansettelsesform ikke oppgitt", value: `${FilterEnum.ENGAGEMENT_TYPE}-${item.key}` }
            : { label: item.key, value: `${FilterEnum.ENGAGEMENT_TYPE}-${item.key}` },
    );
    // extent
    // education
    // workLanguage
    const remoteList = aggregations.remote.map((item) =>
        item.key === "Ikke oppgitt"
            ? { label: "Hjemmekontor ikke oppgitt", value: `${FilterEnum.REMOTE}-${item.key}` }
            : { label: item.key, value: `${FilterEnum.REMOTE}-${item.key}` },
    );

    const occupationSuggestionList = allSuggestions.map((suggestion) => ({
        label: suggestion,
        value: `${FilterEnum.OCCUPATION}-${suggestion}`,
    }));

    return [
        ...occupationSuggestionList,
        ...remoteList,
        ...municipalList,
        ...countyList,
        ...countryList,
        ...sortedByLetterFirstLevelOccupationsList,
        ...sectorList,
        ...engagementTypeList,
    ];
}

ComboboxOptions.propTypes = {
    allSuggestions: PropTypes.arrayOf(PropTypes.string),
    aggregations: PropTypes.shape({}),
    locations: PropTypes.arrayOf(PropTypes.shape({})),
};

export default ComboboxOptions;
