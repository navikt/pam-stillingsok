import { Buldings3Icon, LocationPinIcon } from '@navikt/aksel-icons';
import { BodyLong, HStack } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import getWorkLocation from '@/app/_common/utils/getWorkLocation';

export default function Summary({ adData }) {
  const location = getWorkLocation(adData.location, adData.locationList, false);

  return (
    <section>
      {adData.employer && adData.employer.name ? (
        <HStack align="center" className="mb-2" gap="3" wrap={false}>
          <HStack align="center">
            <Buldings3Icon fontSize="1.5rem" title="Arbeidsgiver" />
          </HStack>
          <BodyLong weight="semibold">{adData.employer.name}</BodyLong>
        </HStack>
      ) : null}
      {location ? (
        <HStack align="center" className="mb-2" gap="3" wrap={false}>
          <HStack align="center">
            <LocationPinIcon fontSize="1.5rem" title="Sted" />
          </HStack>
          <BodyLong weight="semibold">
            {location}
            {adData.remote ? `, ${adData.remote}` : ''}
          </BodyLong>
        </HStack>
      ) : null}
    </section>
  );
}

Summary.propTypes = {
  adData: PropTypes.shape({
    location: PropTypes.string,
    locationList: PropTypes.array,
    remote: PropTypes.string,
    employer: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
};
