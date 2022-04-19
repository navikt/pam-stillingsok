import { Checkbox } from "nav-frontend-skjema";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
    ADD_OCCUPATION_FIRST_LEVEL,
    ADD_OCCUPATION_SECOND_LEVEL,
    REMOVE_OCCUPATION_FIRST_LEVEL,
    REMOVE_OCCUPATION_SECOND_LEVEL
} from "../query";
import CriteriaPanel from "../../../components/criteriaPanel/CriteriaPanel";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import { isMobile } from "../../../utils/utils";
import moveCriteriaToBottom from "./utils/moveFacetToBottom";
import mergeCount from "./utils/mergeCount";
import { findUnknownSearchCriteriaValues } from "./utils/findUnknownSearchCriteriaValues";

const OCCUPATION_LEVEL_OTHER = "Uoppgitt/ ikke identifiserbare";

function Occupations({ initialValues, updatedValues, query, dispatch }) {
    const isOpenByDefault = !isMobile();

    const [values, setValues] = useState(moveCriteriaToBottom(initialValues, OCCUPATION_LEVEL_OTHER));
    const unknownFirstValues = findUnknownSearchCriteriaValues(query.occupationFirstLevels, initialValues);
    const unknownSecondValues = findUnknownSearchCriteriaValues(
        query.occupationSecondLevels,
        initialValues,
        "occupationSecondLevels"
    );

    useEffect(() => {
        if (updatedValues) {
            const merged = mergeCount(values, updatedValues, "occupationSecondLevels");
            setValues(merged);
        }
    }, [updatedValues]);

    function onFirstLevelClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: ADD_OCCUPATION_FIRST_LEVEL, value });
        } else {
            dispatch({ type: REMOVE_OCCUPATION_FIRST_LEVEL, value });
        }
    }

    function onSecondLevelClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: ADD_OCCUPATION_SECOND_LEVEL, value });
        } else {
            dispatch({ type: REMOVE_OCCUPATION_SECOND_LEVEL, value });
        }
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
        <CriteriaPanel panelId="occupations-panel" title="Yrke" isOpenByDefault={isOpenByDefault}>
            {values &&
                values.map((firstLevel) => (
                    <div key={firstLevel.key}>
                        <Checkbox
                            name="occupation"
                            label={`${firstLevel.key} (${firstLevel.count})`}
                            value={firstLevel.key}
                            onChange={onFirstLevelClick}
                            checked={query.occupationFirstLevels.includes(firstLevel.key)}
                        />
                        {query.occupationFirstLevels &&
                            query.occupationFirstLevels.includes(firstLevel.key) &&
                            firstLevel.key !== OCCUPATION_LEVEL_OTHER && (
                                <div className="Facet__inner__items" role="group" aria-label="Velg underkategori">
                                    {firstLevel.occupationSecondLevels &&
                                        firstLevel.occupationSecondLevels.map((secondLevel) => (
                                            <Checkbox
                                                name="occupation"
                                                key={editedSecondLevelItemKey(secondLevel.key)}
                                                label={`${editedSecondLevelItemKey(secondLevel.label)} (${
                                                    secondLevel.count
                                                })`}
                                                value={secondLevel.key}
                                                onChange={onSecondLevelClick}
                                                checked={query.occupationSecondLevels.includes(secondLevel.key)}
                                            />
                                        ))}
                                </div>
                            )}
                    </div>
                ))}

            <UnknownSearchCriteriaValues
                namePrefix="occupation"
                unknownValues={unknownFirstValues}
                unknownNestedValues={unknownSecondValues}
                checkedValues={query.occupationFirstLevels}
                checkedNestedValues={query.occupationSecondLevels}
                onClick={onFirstLevelClick}
                onNestedLevelClick={onSecondLevelClick}
            />
        </CriteriaPanel>
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
                    count: PropTypes.number
                })
            )
        })
    ).isRequired,
    query: PropTypes.shape({
        occupationFirstLevels: PropTypes.arrayOf(PropTypes.string),
        occupationSecondLevels: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default Occupations;
