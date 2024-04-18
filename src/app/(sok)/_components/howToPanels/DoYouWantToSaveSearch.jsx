import {
  BodyShort, Box, Heading, VStack,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import SaveSearchButton from '@/app/lagrede-sok/_components/SaveSearchButton';

function DoYouWantToSaveSearch({ query }) {
  return <Box background="surface-alt-2-subtle" borderRadius="small" padding={{ xs: '4', md: '6' }}>
    <VStack align="center">
      <Heading spacing className="text-center" level="3" size="small">
        Varsel ved nye treff?
      </Heading>
      <BodyShort spacing className="text-center">
        Lagre søket og motta e-post ved nye treff.
      </BodyShort>
      <SaveSearchButton query={query} />
    </VStack>
  </Box>
}

DoYouWantToSaveSearch.propTypes = {
  query: PropTypes.shape({}),
};

export default DoYouWantToSaveSearch;
