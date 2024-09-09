import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Box, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortValuesByFirstLetter from "@/app/(sok)/_components/utils/sortValuesByFirstLetter";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { OCCUPATION_FIRST_LEVEL, OCCUPATION_SECOND_LEVEL } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";

export function editedItemKey(key) {
    return key === "Uoppgitt/ ikke identifiserbare" ? "Ikke oppgitt" : key;
}

const OCCUPATION_LEVEL_OTHER = "Uoppgitt/ ikke identifiserbare";

function Occupations({ initialValues, updatedValues }) {
    const withSortedSecondLevelOccupations = initialValues.map((item) => {
        const secondLevel = sortValuesByFirstLetter(item.occupationSecondLevels);
        return {
            secondLevel,
            ...item,
        };
    });

    const sortedByLetterFirstLevelOccupations = sortValuesByFirstLetter(withSortedSecondLevelOccupations);
    const sortedValues = moveCriteriaToBottom(sortedByLetterFirstLevelOccupations, OCCUPATION_LEVEL_OTHER);
    const values = mergeCount(sortedValues, updatedValues, "occupationSecondLevels");
    const searchQuery = useSearchQuery();

    function handleFirstLevelClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            searchQuery.append(OCCUPATION_FIRST_LEVEL, value);
        } else {
            searchQuery.remove(OCCUPATION_FIRST_LEVEL, value);
            searchQuery.getAll(OCCUPATION_SECOND_LEVEL).forEach((obj) => {
                if (obj.startsWith(`${value}.`)) {
                    searchQuery.remove(OCCUPATION_SECOND_LEVEL, obj);
                }
            });
        }
        logFilterChanged({ name: "Yrke", value, checked, level: "Yrkesnivå 1" });
    }

    function handleSecondLevelClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            searchQuery.append(OCCUPATION_SECOND_LEVEL, value);
        } else {
            searchQuery.remove(OCCUPATION_SECOND_LEVEL, value);
        }
        logFilterChanged({ name: "Yrke", value: value.split(".")[1], checked, level: "Yrkesnivå 2" });
    }

    /**
     * This ensures that 'Tannhelse/-pleie' is displayed as 'Tannlege og tannpleier'
     * in the search filters. It's a mere cosmetic change since the value attributed
     * to the checkbox remains the same. The decision behind this particular change
     * came due to a problem in the categorization of STYRK codes.
     *
     * "Tannhelsesekretærer ligger under samme STYRK som legesekretærer så
     * det er ikke mulig å skille de fra hverandre, og nå er det nærliggende
     * å tro at også tannhelsesekretær-annonser ligger i denne kategorien."
     *
     * @param key
     * @returns {string|*}
     */
    function editedSecondLevelItemKey(key) {
        return key === "Tannhelse/-pleie" ? "Tannlege og tannpleier" : key;
    }

    return (
        <CheckboxGroup
            value={searchQuery.getAll(OCCUPATION_FIRST_LEVEL)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">yrke</span>
                </>
            }
            className="FilterModal__fieldset"
        >
            {values &&
                values.map((firstLevel) => (
                    <React.Fragment key={firstLevel.key}>
                        <Checkbox
                            name="occupationFirstLevels[]"
                            label={`${firstLevel.key} (${firstLevel.count})`}
                            value={firstLevel.key}
                            onChange={handleFirstLevelClick}
                        >
                            {`${editedItemKey(firstLevel.key)} (${firstLevel.count})`}
                        </Checkbox>
                        {searchQuery.has(OCCUPATION_FIRST_LEVEL, firstLevel.key) &&
                            firstLevel.key !== OCCUPATION_LEVEL_OTHER && (
                                <CheckboxGroup
                                    defaultValue={searchQuery.getAll(OCCUPATION_SECOND_LEVEL)}
                                    hideLegend
                                    legend={`Yrker innen ${firstLevel.key}`}
                                >
                                    <Box paddingInline="8 0">
                                        {firstLevel.occupationSecondLevels &&
                                            firstLevel.occupationSecondLevels.map((secondLevel) => (
                                                <Checkbox
                                                    name="occupationSecondLevels[]"
                                                    key={editedSecondLevelItemKey(secondLevel.key)}
                                                    value={secondLevel.key}
                                                    onChange={handleSecondLevelClick}
                                                >
                                                    {`${editedSecondLevelItemKey(secondLevel.label)} (${
                                                        secondLevel.count
                                                    })`}
                                                </Checkbox>
                                            ))}
                                    </Box>
                                </CheckboxGroup>
                            )}
                    </React.Fragment>
                ))}
        </CheckboxGroup>
    );
}

Occupations.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
            occupationSecondLevels: PropTypes.arrayOf(
                PropTypes.shape({
                    key: PropTypes.string,
                    count: PropTypes.number,
                }),
            ),
        }),
    ).isRequired,
    updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Occupations;
