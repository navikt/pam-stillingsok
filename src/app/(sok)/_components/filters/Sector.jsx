import { Checkbox, Fieldset } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import mergeCount from '@/app/(sok)/_components/utils/mergeCount';
import { ADD_SECTOR, REMOVE_SECTOR } from '@/app/(sok)/_utils/queryReducer';
import { logSearchFilterAdded, logSearchFilterRemoved } from '@/app/_common/monitoring/amplitude';

const Sector = ({
  initialValues, updatedValues, query, dispatch,
}) => {
  const values = mergeCount(initialValues, updatedValues);

  function handleClick(e) {
    const { value } = e.target;
    if (e.target.checked) {
      dispatch({ type: ADD_SECTOR, value });
      logSearchFilterAdded({ sektor: value });
    } else {
      dispatch({ type: REMOVE_SECTOR, value });
      logSearchFilterRemoved({ sektor: value });
    }
  }

  return (
    <Fieldset hideLegend legend="Filtrer etter sektor">
      <div>
        {values.map((item) => (
          <Checkbox
            key={item.key}
            checked={query.sector.includes(item.key)}
            name="sector[]"
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

Sector.propTypes = {
  initialValues: PropTypes.arrayOf(PropTypes.shape({})),
  updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
  sector: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      count: PropTypes.number,
    }),
  ),
  query: PropTypes.shape({
    sector: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Sector;
