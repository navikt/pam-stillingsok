import { Box, Checkbox, Fieldset } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import mergeCount from '@/app/(sok)/_components/utils/mergeCount';
import moveCriteriaToBottom from '@/app/(sok)/_components/utils/moveFacetToBottom';
import {
  ADD_OCCUPATION_FIRST_LEVEL,
  ADD_OCCUPATION_SECOND_LEVEL,
  REMOVE_OCCUPATION_FIRST_LEVEL,
  REMOVE_OCCUPATION_SECOND_LEVEL,
} from '@/app/(sok)/_utils/queryReducer';
import { logSearchFilterAdded, logSearchFilterRemoved } from '@/app/_common/monitoring/amplitude';

const OCCUPATION_LEVEL_OTHER = 'Uoppgitt/ ikke identifiserbare';

const Occupations = ({
  initialValues, updatedValues, query, dispatch,
}) => {
  const sortedValues = moveCriteriaToBottom(initialValues, OCCUPATION_LEVEL_OTHER);
  const values = mergeCount(sortedValues, updatedValues, 'occupationSecondLevels');

  function handleFirstLevelClick(e) {
    const { value } = e.target;
    if (e.target.checked) {
      dispatch({ type: ADD_OCCUPATION_FIRST_LEVEL, value });
      logSearchFilterAdded({ yrke: value });
    } else {
      dispatch({ type: REMOVE_OCCUPATION_FIRST_LEVEL, value });
      logSearchFilterRemoved({ yrke: value });
    }
  }

  function handleSecondLevelClick(e) {
    const { value } = e.target;
    if (e.target.checked) {
      dispatch({ type: ADD_OCCUPATION_SECOND_LEVEL, value });
      logSearchFilterAdded({ yrke: value });
    } else {
      dispatch({ type: REMOVE_OCCUPATION_SECOND_LEVEL, value });
      logSearchFilterRemoved({ yrke: value });
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
    return key === 'Tannhelse/-pleie' ? 'Tannlege og tannpleier' : key;
  }

  return (
    <Fieldset hideLegend className="FilterModal__fieldset" legend="Filtrer etter yrkesgruppe">
      <div>
        {values ? values.map((firstLevel) => (
          <React.Fragment key={firstLevel.key}>
            <Checkbox
              checked={query.occupationFirstLevels.includes(firstLevel.key)}
              label={`${firstLevel.key} (${firstLevel.count})`}
              name="occupationFirstLevels[]"
              value={firstLevel.key}
              onChange={handleFirstLevelClick}
            >
              {`${firstLevel.key} (${firstLevel.count})`}
            </Checkbox>
            {query.occupationFirstLevels
                                && query.occupationFirstLevels.includes(firstLevel.key)
                                && firstLevel.key !== OCCUPATION_LEVEL_OTHER ? (
                                  <Fieldset hideLegend legend={`Yrker innen ${firstLevel.key}`}>
                                    <Box paddingInline="8 0">
                                      {firstLevel.occupationSecondLevels ? firstLevel.occupationSecondLevels.map((secondLevel) => (
                                        <Checkbox
                                          key={editedSecondLevelItemKey(secondLevel.key)}
                                          checked={query.occupationSecondLevels.includes(secondLevel.key)}
                                          name="occupationSecondLevels[]"
                                          value={secondLevel.key}
                                          onChange={handleSecondLevelClick}
                                        >
                                          {`${editedSecondLevelItemKey(secondLevel.label)} (${
                                            secondLevel.count
                                          })`}
                                        </Checkbox>
                                      )) : null}
                                    </Box>
                                  </Fieldset>
              ) : null}
          </React.Fragment>
        )) : null}
      </div>
    </Fieldset>
  );
};

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
