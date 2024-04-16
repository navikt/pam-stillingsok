import { ExternalLinkIcon } from '@navikt/aksel-icons';
import {
  Link as AkselLink,
  BodyLong,
  Box,
  Button,
  CopyButton,
  HStack,
  Heading,
  Label,
  Stack,
  VStack,
} from '@navikt/ds-react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import logAmplitudeEvent from '@/app/_common/monitoring/amplitude';
import deadlineText from '@/app/_common/utils/deadlineText';
import { formatDate, isValidUrl } from '@/app/_common/utils/utils';

const logApplyForPosition = (adData) => {
  try {
    logAmplitudeEvent('Stilling sok-via-url', {
      title: adData.title,
      id: adData.id,
    });
  } catch (e) {
    // ignore
  }
};

const logCopyEmailClick = (adData) => {
  try {
    logAmplitudeEvent('Stilling copy-email', {
      title: adData.title,
      id: adData.id,
    });
  } catch (e) {
    // ignore
  }
};

const logEmailAnchorClick = (adData) => {
  try {
    logAmplitudeEvent('Stilling email-anchor-click', {
      title: adData.title,
      id: adData.id,
    });
  } catch (e) {
    // ignore
  }
};

export default function HowToApply({ adData }) {
  const applicationUrl = (adData.applicationUrl && (adData.applicationUrl.url || adData.applicationUrl.dangerouslyInvalidUrl))
        || (adData.sourceUrl && (adData.sourceUrl.url || adData.sourceUrl.dangerouslyInvalidUrl));
  const isFinn = adData.source === 'FINN';
  const path = 'stilling';
  const deadline = adData.applicationDue ? formatDate(adData.applicationDue) : undefined;

  if (adData.hasSuperraskSoknad === 'true') {
    return (
      <Box background="surface-alt-1-moderate" borderRadius="medium" className="full-width mb-10" padding="4">
        <Stack
          align={{ xs: 'start', sm: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
          gap="4"
          justify="space-between"
        >
          <VStack>
            <Heading spacing level="2" size="medium">
              Søk på jobben
            </Heading>
            {deadline ? <BodyLong>{deadlineText(deadline, new Date(), adData.applicationDue)}</BodyLong> : null}
          </VStack>
          {adData.status === 'ACTIVE' && (
          <div>
            <Button
              as={Link}
              href={`/${path}/${adData.id}/superrask-soknad`}
              onClick={() => {
                logAmplitudeEvent('click superrask søknad link', {
                  id: adData.id,
                });
              }}
            >
              Gå til superrask søknad
            </Button>
          </div>
          )}
        </Stack>
        {!isFinn && adData.applicationEmail ? (
          <BodyLong className="mt-4">
            Alternativt kan du sende søknad via e-post til
            {' '}
            <HStack as="span" gap="2" wrap={false}>
              <span>
                <AkselLink
                  href={`mailto:${adData.applicationEmail}`}
                  onClick={() => {
                    logEmailAnchorClick(adData);
                  }}
                >
                  {adData.applicationEmail}
                </AkselLink>
              </span>
              <span>
                <CopyButton
                  copyText={`${adData.applicationEmail}`}
                  size="xsmall"
                  title="Kopier e-postadresse"
                  variant="action"
                  onActiveChange={(state) => {
                    if (state === true) {
                      logCopyEmailClick(adData);
                    }
                  }}
                />
              </span>
            </HStack>
          </BodyLong>
        ) : null}
        {applicationUrl ? (
          <BodyLong className="mt-4">
            Alternativt kan du
            {' '}
            <AkselLink href={applicationUrl} onClick={() => logApplyForPosition(adData)}>
              sende søknad her.
            </AkselLink>
          </BodyLong>
        ) : null}
      </Box>
    );
  }

  if (adData.applicationDue || adData.applicationEmail || applicationUrl) {
    return (
      <Box background="surface-alt-1-moderate" borderRadius="medium" className="full-width mb-10" padding="4">
        <Stack
          align={{ xs: 'start', sm: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
          gap="4"
          justify="space-between"
        >
          <VStack>
            <Heading spacing level="2" size="medium">
              Søk på jobben
            </Heading>
            {deadline ? <BodyLong>{deadlineText(deadline, new Date(), adData.applicationDue)}</BodyLong> : null}
          </VStack>
          {applicationUrl && isValidUrl(applicationUrl) ? (
            <div>
              <Button
                as="a"
                href={applicationUrl}
                icon={<ExternalLinkIcon aria-hidden="true" />}
                role="link"
                variant="primary"
                onClick={() => logApplyForPosition(adData)}
              >
                Gå til søknad
              </Button>
            </div>
          ) : null}
        </Stack>
        {!isFinn && adData.applicationEmail ? (
          <div className="mt-4">
            <Label as="p">Send søknad til</Label>
            <BodyLong>
              <HStack as="span" gap="2" wrap={false}>
                <span>
                  <AkselLink
                    href={`mailto:${adData.applicationEmail}`}
                    onClick={() => {
                      logEmailAnchorClick(adData);
                    }}
                  >
                    {adData.applicationEmail}
                  </AkselLink>
                </span>
                <span>
                  <CopyButton
                    copyText={`${adData.applicationEmail}`}
                    size="xsmall"
                    title="Kopier e-postadresse"
                    variant="action"
                    onActiveChange={(state) => {
                      if (state === true) {
                        logCopyEmailClick(adData);
                      }
                    }}
                  />
                </span>
              </HStack>
            </BodyLong>
          </div>
        ) : null}
        {applicationUrl && !isValidUrl(applicationUrl) ? (
          <>
            <Label as="p">Søknadslenke</Label>
            <BodyLong>{applicationUrl}</BodyLong>
          </>
        ) : null}
        {isFinn && !adData.applicationUrl ? <BodyLong className="mt-4">Søk via opprinnelig annonse på FINN.no.</BodyLong> : null}
      </Box>
    );
  }
  return null;
}

HowToApply.propTypes = {
  adData: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    applicationUrl: PropTypes.shape({
      url: PropTypes.string,
      dangerouslyInvalidUrl: PropTypes.string,
    }),
    sourceUrl: PropTypes.shape({
      url: PropTypes.string,
      dangerouslyInvalidUrl: PropTypes.string,
    }),
    source: PropTypes.string,
    hasSuperraskSoknad: PropTypes.string,
    applicationDue: PropTypes.string,
    applicationEmail: PropTypes.string,
  }).isRequired,
};
