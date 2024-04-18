import { Checkbox, Fieldset } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import mergeCount from '@/app/(sok)/_components/utils/mergeCount';
import { ADD_EXTENT, REMOVE_EXTENT } from '@/app/(sok)/_utils/queryReducer';
import { logSearchFilterAdded, logSearchFilterRemoved } from '@/app/_common/monitoring/amplitude';

function Extent({
  initialValues, updatedValues, query, dispatch,
}) {
  const values = mergeCount(initialValues, updatedValues);

  function handleClick(e) {
    const { value } = e.target;
    if (e.target.checked) {
      dispatch({ type: ADD_EXTENT, value });
      logSearchFilterAdded({ extent: value });
    } else {
      dispatch({ type: REMOVE_EXTENT, value });
      logSearchFilterRemoved({ extent: value });
    }
  }

  function labelForExtent(item) {
    return item.key === 'Heltid' ? `${item.key} eller ikke oppgitt` : `${item.key}`;
  }

  return (
    <Fieldset hideLegend legend="Filtrer etter heltid/deltid">
      <div>
        {values.map((item) => (
          <Checkbox
            key={item.key}
            checked={query.extent.includes(item.key)}
            name="extent[]"
            value={item.key}
            onChange={handleClick}
          >
            {`${labelForExtent(item)} (${item.count})`}
          </Checkbox>
        ))}
      </div>
    </Fieldset>
  );
}

Extent.propTypes = {
  initialValues: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      count: PropTypes.number,
    }),
  ).isRequired,
  updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
  query: PropTypes.shape({
    extent: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Extent;
