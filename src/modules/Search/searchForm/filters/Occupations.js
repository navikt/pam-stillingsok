import PropTypes from "prop-types";
import React from "react";
import {
    ADD_OCCUPATION_FIRST_LEVEL,
    ADD_OCCUPATION_SECOND_LEVEL,
    REMOVE_OCCUPATION_FIRST_LEVEL,
    REMOVE_OCCUPATION_SECOND_LEVEL
} from "../../query";
import CriteriaPanel from "./CriteriaPanel";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import moveCriteriaToBottom from "../utils/moveFacetToBottom";
import { Checkbox } from "@navikt/ds-react";

const OCCUPATION_LEVEL_OTHER = "Uoppgitt/ ikke identifiserbare";

function Occupations({ data, query, dispatch }) {
    const values = moveCriteriaToBottom(data.aggregations.occupationFirstLevels, OCCUPATION_LEVEL_OTHER);

    function handleFirstLevelClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: ADD_OCCUPATION_FIRST_LEVEL, value });
        } else {
            dispatch({ type: REMOVE_OCCUPATION_FIRST_LEVEL, value });
        }
    }

    function handleSecondLevelClick(e) {
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
        <CriteriaPanel panelId="occupations-panel" title="Yrke">
            <fieldset className="CriteriaPanel__fieldset">
                <legend>Velg yrke</legend>
                {values &&
                    values.map((firstLevel) => (
                        <React.Fragment key={firstLevel.key}>
                            <Checkbox
                                name="occupation"
                                value={firstLevel.key}
                                onChange={handleFirstLevelClick}
                                checked={query.occupationFirstLevels.includes(firstLevel.key)}
                            >
                                {`${firstLevel.key} (${firstLevel.count})`}
                            </Checkbox>
                            {query.occupationFirstLevels &&
                                query.occupationFirstLevels.includes(firstLevel.key) &&
                                firstLevel.key !== OCCUPATION_LEVEL_OTHER && (
                                    <fieldset className="CriteriaPanel__fieldset CriteriaPanel__fieldset--sub">
                                        <legend>Yrker innen {firstLevel.key}</legend>
                                        {firstLevel.occupationSecondLevels &&
                                            firstLevel.occupationSecondLevels.map((secondLevel) => (
                                                <Checkbox
                                                    name="occupation"
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
                                    </fieldset>
                                )}
                        </React.Fragment>
                    ))}

                <UnknownSearchCriteriaValues
                    namePrefix="occupation"
                    unknownValues={data.unknown.occupationFirstLevels}
                    unknownNestedValues={data.unknown.occupationSecondLevels}
                    checkedValues={query.occupationFirstLevels}
                    checkedNestedValues={query.occupationSecondLevels}
                    onClick={handleFirstLevelClick}
                    onNestedLevelClick={handleSecondLevelClick}
                    shouldFixLocationName={true}
                />
            </fieldset>
        </CriteriaPanel>
    );
}

Occupations.propTypes = {
    query: PropTypes.shape({
        occupationFirstLevels: PropTypes.arrayOf(PropTypes.string),
        occupationSecondLevels: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default Occupations;
