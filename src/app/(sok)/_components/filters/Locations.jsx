import {
  BodyShort, Box, Checkbox, Fieldset,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import buildLocations from '@/app/(sok)/_components/utils/buildLocations';
import {
  ADD_COUNTRY,
  ADD_COUNTY,
  ADD_MUNICIPAL,
  REMOVE_COUNTRY,
  REMOVE_COUNTY,
  REMOVE_MUNICIPAL,
  SET_INTERNATIONAL,
} from '@/app/(sok)/_utils/queryReducer';
import { logSearchFilterAdded, logSearchFilterRemoved } from '@/app/_common/monitoring/amplitude';
import fixLocationName from '@/app/_common/utils/fixLocationName';

function Locations({
  locations, query, dispatch, updatedValues,
}) {
  const locationValues = buildLocations(updatedValues.aggregations, locations);

  function handleLocationClick(value, type, checked) {
    if (type === 'county') {
      if (checked) {
        logSearchFilterAdded({ sted: value });
        dispatch({ type: ADD_COUNTY, value });
      } else {
        dispatch({ type: REMOVE_COUNTY, value });
        logSearchFilterRemoved({ sted: value });
      }
    } else if (type === 'municipal') {
      if (checked) {
        dispatch({ type: ADD_MUNICIPAL, value });
        logSearchFilterAdded({ sted: value });
      } else {
        dispatch({ type: REMOVE_MUNICIPAL, value });
        logSearchFilterRemoved({ sted: value });
      }
    } else if (type === 'country') {
      if (checked) {
        dispatch({ type: ADD_COUNTRY, value });
        logSearchFilterAdded({ sted: value });
      } else {
        dispatch({ type: REMOVE_COUNTRY, value });
        logSearchFilterRemoved({ sted: value });
      }
    } else if (type === 'international') {
      if (query.international) {
        query.countries.forEach((c) => {
          dispatch({ type: REMOVE_COUNTRY, value: c });
        });
      }
      dispatch({ type: SET_INTERNATIONAL, value: !query.international });
    }
  }

  const handleCheckboxClick = (key, type) => (e) => {
    handleLocationClick(key, type, e.target.checked);
  };

  return (
    <Fieldset hideLegend className="FilterModal__fieldset" legend="Filtrer etter fylke, kommune eller land">
      <div>
        {locationValues ? locationValues.map((location) => (
          <React.Fragment key={location.key}>
            {location.key === 'UTLAND' ? (
              <Checkbox
                checked={query.international === true}
                name="international"
                value="true"
                onChange={handleCheckboxClick(location.key, location.type)}
              >
                Utland
              </Checkbox>
            ) : (
              <Checkbox
                checked={query.counties.includes(location.key)}
                name="counties[]"
                value={location.key}
                onChange={handleCheckboxClick(location.key, location.type)}
              >
                <span translate="no">{`${fixLocationName(location.key)} (${location.count})`}</span>
              </Checkbox>
            )}

            {(query.counties.includes(location.key)
                                || (location.key === 'UTLAND' && query.international === true))
                                && location.key !== 'OSLO'
                                && location.key !== 'SVALBARD' && (
                                <Box paddingInline="8 0">
                                  <Fieldset hideLegend legend={`Områder i ${fixLocationName(location.key)}`}>
                                    <div>
                                      {location.subLocations ? location.subLocations.map((subLocation) => (
                                        <Checkbox
                                          key={subLocation.key}
                                          value={subLocation.key}
                                          checked={
                                                                query.municipals.includes(subLocation.key)
                                                                || query.countries.includes(subLocation.key)
                                                            }
                                          name={
                                                                location.key === 'UTLAND'
                                                                  ? 'countries[]'
                                                                  : 'municipals[]'
                                                            }
                                          onChange={handleCheckboxClick(
                                            subLocation.key,
                                            subLocation.type,
                                          )}
                                        >
                                          <BodyShort
                                            translate="no"
                                            textColor={
                                                                    subLocation.count === 0 ? 'subtle' : 'default'
                                                                }
                                          >
                                            {`${fixLocationName(subLocation.key, true)} (${
                                              subLocation.count
                                            })`}
                                          </BodyShort>
                                        </Checkbox>
                                      )) : null}
                                    </div>
                                  </Fieldset>
                                </Box>
            )}
          </React.Fragment>
        )) : null}
      </div>
    </Fieldset>
  );
}

Locations.propTypes = {
  updatedValues: PropTypes.shape({
    aggregations: PropTypes.shape({
      internationalCountMap: PropTypes.object,
      nationalCountMap: PropTypes.object,
    }),
  }),
  locations: PropTypes.arrayOf(PropTypes.object),
  query: PropTypes.shape({
    countries: PropTypes.arrayOf(PropTypes.string),
    counties: PropTypes.arrayOf(PropTypes.string),
    municipals: PropTypes.arrayOf(PropTypes.string),
    international: PropTypes.bool,
  }),
  dispatch: PropTypes.func.isRequired,
};

export default Locations;
