import { XMarkIcon } from '@navikt/aksel-icons';
import {
  Bleed, BodyLong, BodyShort, Box, Button, HStack, Heading,
} from '@navikt/ds-react';
import Link from 'next/link';
import React, { useContext } from 'react';

import { UserPreferencesContext } from '@/app/_common/user/UserPreferenceProvider';

const ShareYourOpinionPanel = () => {
  const { dismissPanel, dismissedPanels } = useContext(UserPreferencesContext);

  function dismiss() {
    dismissPanel('new-filters-survey');
  }

  if (dismissedPanels.includes('new-filters-survey')) {
    return null;
  }

  return (
    <Box background="surface-alt-2-subtle" borderRadius="small" className="mb-4" padding={{ xs: '4', md: '6' }}>
      <HStack align="start" justify="space-between" wrap={false}>
        <Heading className="mb-05" level="2" size="small">
          Del din mening!
        </Heading>
        <Bleed asChild marginBlock="1 0" marginInline="0 1">
          <Button
            icon={<XMarkIcon aria-label="Lukk" height="1em" width="1em" />}
            size="small"
            variant="tertiary-neutral"
            onClick={dismiss}
          />
        </Bleed>
      </HStack>
      <BodyShort className="mb-4">
        Vi utforsker nye filtre og vil gjere høre fra deg før vi går videre med forslagene.
      </BodyShort>

      <BodyLong>
        <Button as={Link} href="/tilbakemelding-nye-filtre" variant="secondary">
          Vis nye filterforslag
        </Button>
      </BodyLong>
    </Box>
  );
};

export default ShareYourOpinionPanel;
