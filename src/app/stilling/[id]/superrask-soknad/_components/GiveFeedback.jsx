import {
  Link as AkselLink, BodyLong, Box, Heading,
} from '@navikt/ds-react';
import React from 'react';

const GiveFeedback = () => (
  <Box background="surface-alt-3-subtle" borderRadius="small" className="mt-12" padding={{ xs: '4', md: '6' }}>
    <Heading spacing level="2" size="medium">
      Hvordan kan vi forbedre denne tjenesten for deg?
    </Heading>
    <BodyLong spacing>
      Vi setter stor pris på dine tilbakemeldinger dersom det er noe du savner eller noe du synes kunne vært
      bedre med denne tjenesten.
    </BodyLong>
    <BodyLong>
      <AkselLink href="https://surveys.hotjar.com/096eea6f-8509-467b-b627-20b40340d1f8">
        Skriv en kort tilbakemelding
      </AkselLink>
    </BodyLong>
  </Box>
);

export default GiveFeedback;
