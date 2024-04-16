import { Checkbox, Fieldset } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import mergeCount from '@/app/(sok)/_components/utils/mergeCount';
import moveCriteriaToBottom from '@/app/(sok)/_components/utils/moveFacetToBottom';
import { ADD_WORKLANGUAGE, REMOVE_WORKLANGUAGE } from '@/app/(sok)/_utils/queryReducer';
import { logSearchFilterAdded, logSearchFilterRemoved } from '@/app/_common/monitoring/amplitude';

const WorkLanguage = ({
  initialValues, updatedValues, query, dispatch,
}) => {
  const sortedValues = moveCriteriaToBottom(initialValues, 'Ikke oppgitt');
  const values = mergeCount(sortedValues, updatedValues);

  function handleClick(e) {
    const { value } = e.target;
    if (e.target.checked) {
      dispatch({ type: ADD_WORKLANGUAGE, value });
      logSearchFilterAdded({ arbeidsspraak: value });
    } else {
      dispatch({ type: REMOVE_WORKLANGUAGE, value });
      logSearchFilterRemoved({ arbeidsspraak: value });
    }
  }

  return (
    <Fieldset hideLegend legend="Filtrer etter arbeidsspråk">
      <div>
        {values.map((item) => (
          <Checkbox
            key={item.key}
            checked={query.workLanguage.includes(item.key)}
            name="workLanguage[]"
            value={item.key}
            onChange={handleClick}
          >
            {`${item.key} (${item.count})`}
          </Checkbox>
        ))}
      </div>
    </Fieldset>
  );
};

WorkLanguage.propTypes = {
  initialValues: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      count: PropTypes.number,
    }),
  ).isRequired,
  updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
  query: PropTypes.shape({
    workLanguage: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default WorkLanguage;
