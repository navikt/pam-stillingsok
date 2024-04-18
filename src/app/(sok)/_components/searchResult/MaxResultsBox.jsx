import {
  BodyShort, Box, HStack, Heading,
} from '@navikt/ds-react';
import React from 'react';

import DetectiveIcon from '../icons/DetectiveIcon';

function MaxResultsBox() {
  return <Box background="surface-alt-1-subtle" borderRadius="small" padding={{ xs: '4', md: '6' }}>
    <HStack align="center" gap="2" justify="center" wrap={false}>
      <Box>
        <Heading spacing level="3" size="small">
          Du har nådd maks antall annonser for ditt søk
        </Heading>
        <BodyShort spacing>
          Utvid søket ditt ved å prøve andre filtre eller søkeord for å oppdage flere annonser.
        </BodyShort>
      </Box>

      <Box paddingInline="4">
        <DetectiveIcon />
      </Box>
    </HStack>
  </Box>
}

export default MaxResultsBox;
