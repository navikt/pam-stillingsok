import { Checkbox, Fieldset } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import mergeCount from '@/app/(sok)/_components/utils/mergeCount';
import { PublishedLabelsEnum } from '@/app/(sok)/_utils/query';
import { SET_PUBLISHED } from '@/app/(sok)/_utils/queryReducer';

const Published = ({
  dispatch, query, initialValues, updatedValues,
}) => {
  const values = mergeCount(initialValues, updatedValues);

  function handleClick(e) {
    const { value } = e.target;
    if (e.target.checked) {
      dispatch({ type: SET_PUBLISHED, value });
    } else {
      dispatch({ type: SET_PUBLISHED, undefined });
    }
  }

  return (
    <Fieldset hideLegend legend="Filtrer etter når annonsen var publisert">
      <div>
        {values.map((item) => (
          <Checkbox
            key={item.key}
            checked={query.published === item.key}
            name="published"
            value={item.key}
            onChange={handleClick}
          >
            {`${PublishedLabelsEnum[item.key]} (${item.count})`}
          </Checkbox>
        ))}
      </div>
    </Fieldset>
  );
};

Published.propTypes = {
  initialValues: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      count: PropTypes.number,
    }),
  ).isRequired,
  updatedValues: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      count: PropTypes.number,
    }),
  ),
  query: PropTypes.shape({
    published: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Published;
