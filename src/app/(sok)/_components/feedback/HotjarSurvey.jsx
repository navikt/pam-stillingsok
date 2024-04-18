import { XMarkIcon } from '@navikt/aksel-icons';
import {
  Link as AkselLink, BodyLong, BodyShort, Box, Button, HStack, Heading,
} from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';

function HotjarSurvey() {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    try {
      const found = sessionStorage.getItem('feedback-hotjar-dismissed');
      if (!found) {
        setIsDismissed(false);
      } else {
        setIsDismissed(true);
      }
    } catch (e) {
      setIsDismissed(false);
    }
  }, []);

  function dismiss() {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('feedback-hotjar-dismissed', 'true');
    } catch (e) {
      // ignore sessionStorage error
    }
  }

  if (isDismissed) {
    return null;
  }

  return (
    <Box background="surface-alt-2-subtle" borderRadius="small" padding={{ xs: '4', md: '6' }}>
      <HStack align="start" justify="space-between" wrap={false}>
        <Heading spacing level="2" size="small">
          Hjelp oss med å forbedre opplevelsen for deg som ser etter jobber
        </Heading>
        <Button
          icon={<XMarkIcon aria-label="Lukk" height="1em" width="1em" />}
          size="small"
          variant="tertiary-neutral"
          onClick={dismiss}
        />
      </HStack>
      <BodyShort spacing>
        Hva er viktig for deg når du ser etter jobber? Hva frustrerer deg mest? Gi oss innspill ved å svare på
        noen korte spørsmål. Spørreundersøkelsen er på norsk og er anonym.
      </BodyShort>

      <BodyLong>
        <AkselLink href="https://surveys.hotjar.com/11b59436-15fe-4b2c-b4c2-c6304c54dfb1">
          Svar på noen korte spørsmål
        </AkselLink>
      </BodyLong>
    </Box>
  );
}

export default HotjarSurvey;
