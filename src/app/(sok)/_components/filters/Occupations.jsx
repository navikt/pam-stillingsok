import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Box, Checkbox, Fieldset } from "@navikt/ds-react";
import {
    ADD_OCCUPATION_FIRST_LEVEL,
    ADD_OCCUPATION_SECOND_LEVEL,
    REMOVE_OCCUPATION_FIRST_LEVEL,
    REMOVE_OCCUPATION_SECOND_LEVEL,
} from "@/app/(sok)/_utils/queryReducer";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortValuesByFirstLetter from "@/app/(sok)/_components/utils/sortValuesByFirstLetter";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";

const OCCUPATION_LEVEL_OTHER = "Uoppgitt/ ikke identifiserbare";

function Occupations({ initialValues, updatedValues, query, dispatch }) {
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

    function handleFirstLevelClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            dispatch({ type: ADD_OCCUPATION_FIRST_LEVEL, value });
        } else {
            dispatch({ type: REMOVE_OCCUPATION_FIRST_LEVEL, value });
        }
        logFilterChanged({ name: "occupation", value, checked, level: 1 });
    }

    function handleSecondLevelClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            dispatch({ type: ADD_OCCUPATION_SECOND_LEVEL, value });
        } else {
            dispatch({ type: REMOVE_OCCUPATION_SECOND_LEVEL, value });
        }
        logFilterChanged({ name: "occupation", value: value.split(".")[1], checked, level: 2 });
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
        <Fieldset
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
            <div>
                {values &&
                    values.map((firstLevel) => (
                        <React.Fragment key={firstLevel.key}>
                            <Checkbox
                                name="occupationFirstLevels[]"
                                label={`${firstLevel.key} (${firstLevel.count})`}
                                value={firstLevel.key}
                                onChange={handleFirstLevelClick}
                                checked={query.occupationFirstLevels.includes(firstLevel.key)}
                            >
                                {`${firstLevel.key} (${firstLevel.count})`}
                            </Checkbox>
                            {query.occupationFirstLevels &&
                                query.occupationFirstLevels.includes(firstLevel.key) &&
                                firstLevel.key !== OCCUPATION_LEVEL_OTHER && (
                                    <Fieldset hideLegend legend={`Yrker innen ${firstLevel.key}`}>
                                        <Box paddingInline="8 0">
                                            {firstLevel.occupationSecondLevels &&
                                                firstLevel.occupationSecondLevels.map((secondLevel) => (
                                                    <Checkbox
                                                        name="occupationSecondLevels[]"
                                                        key={editedSecondLevelItemKey(secondLevel.key)}
                                                        value={secondLevel.key}
                                                        onChange={handleSecondLevelClick}
                                                        checked={query.occupationSecondLevels.includes(secondLevel.key)}
                                                    >
                                                        {`${editedSecondLevelItemKey(secondLevel.label)} (${
                                                            secondLevel.count
                                                        })`}
                                                    </Checkbox>
                                                ))}
                                        </Box>
                                    </Fieldset>
                                )}
                        </React.Fragment>
                    ))}
            </div>
        </Fieldset>
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
    query: PropTypes.shape({
        occupationFirstLevels: PropTypes.arrayOf(PropTypes.string),
        occupationSecondLevels: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default Occupations;
