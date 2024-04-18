import { Select } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import { SET_SORTING } from '@/app/(sok)/_utils/queryReducer';

function Sorting({ query, dispatch }) {
  function handleChange(e) {
    const { value } = e.target;
    dispatch({ type: SET_SORTING, value });
  }

  return (
    <Select
      className="inline-select"
      label="Sorter etter"
      value={query.sort || 'published'}
      onChange={handleChange}
    >
      <option key="published" value="published">
        Nyeste øverst
      </option>
      <option key="relevant" value="relevant">
        Mest relevant
      </option>
      <option key="expires" value="expires">
        Søknadsfrist
      </option>
    </Select>
  );
}

Sorting.propTypes = {
  query: PropTypes.shape({
    sort: PropTypes.string.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Sorting;
