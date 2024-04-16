import { Checkbox, Fieldset } from '@navikt/ds-react';
import React from 'react';

import mergeCount from '@/app/(sok)/_components/utils/mergeCount';
import moveCriteriaToBottom from '@/app/(sok)/_components/utils/moveFacetToBottom';
import { ADD_REMOTE, REMOVE_REMOTE } from '@/app/(sok)/_utils/queryReducer';
import { logSearchFilterAdded, logSearchFilterRemoved } from '@/app/_common/monitoring/amplitude';

const Remote = ({
  initialValues, updatedValues, query, dispatch,
}) => {
  const values = mergeCount(initialValues, updatedValues);
  const sortedValues = moveCriteriaToBottom(values, 'Ikke oppgitt');

  function labelForRemote(label) {
    switch (label) {
      case 'Hybridkontor':
        return 'Hybrid';
      case 'Hjemmekontor':
        return 'Kun hjemmekontor';
      default:
        return label;
    }
  }

  function handleClick(e) {
    const { value } = e.target;
    console.log('remote handleClick:', value);
    if (e.target.checked) {
      dispatch({ type: ADD_REMOTE, value });
      logSearchFilterAdded({ remote: value });
    } else {
      dispatch({ type: REMOVE_REMOTE, value });
      logSearchFilterRemoved({ remote: value });
    }
  }

  return (
    <Fieldset hideLegend legend="Filtrer etter hjemmekontormuligheter">
      <div>
        {sortedValues.map((item) => (
          <Checkbox
            key={item.key}
            checked={query.remote.includes(item.key)}
            name="remote[]"
            value={item.key}
            onChange={handleClick}
          >
            {`${labelForRemote(item.key)} (${item.count})`}
          </Checkbox>
        ))}
      </div>
    </Fieldset>
  );
};

export default Remote;
