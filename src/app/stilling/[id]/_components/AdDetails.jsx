import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import {
  BodyShort, Button, Heading, Label, Stack,
} from '@navikt/ds-react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import { formatDate } from '@/app/_common/utils/utils';
import ShareAd from '@/app/stilling/[id]/_components/ShareAd';

export default function AdDetails({ adData }) {
  return (
    <section className="full-width">
      <Stack
        align={{ xs: 'start', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        gap="5"
        justify="space-between"
      >
        <Heading level="2" size="large">
          Annonsedata
        </Heading>
        <Button
          as={Link}
          className="report-ad-button"
          href={`/rapporter-annonse/${adData.id}`}
          icon={<ExclamationmarkTriangleIcon aria-hidden />}
          variant="tertiary"
        >
          Rapporter annonse
        </Button>
        <dl className="ad-description-list">
          {adData.adNumber ? (
            <div>
              <dt>
                <Label as="span">Stillingsnummer</Label>
              </dt>
              <dd>
                <BodyShort spacing>{adData.adNumber}</BodyShort>
              </dd>
            </div>
          ) : null}
          {adData.updated ? (
            <div>
              <dt>
                <Label as="span">Sist endret</Label>
              </dt>
              <dd>
                <BodyShort spacing>{formatDate(adData.updated)}</BodyShort>
              </dd>
            </div>
          ) : null}
          {adData.medium ? (
            <div>
              <dt>
                <Label as="span">Hentet fra</Label>
              </dt>
              <dd>
                <BodyShort spacing>{adData.medium}</BodyShort>
              </dd>
            </div>
          ) : null}
          {adData.reference ? (
            <div>
              <dt>
                <Label as="span">Referanse</Label>
              </dt>
              <dd>
                <BodyShort spacing>{adData.reference}</BodyShort>
              </dd>
            </div>
          ) : null}
        </dl>
      </Stack>
    </section>
  );
}
ShareAd.propTypes = {
  adData: PropTypes.shape({
    id: PropTypes.string,
    updated: PropTypes.string,
    medium: PropTypes.string,
    reference: PropTypes.string,
    adNumber: PropTypes.string,
  }).isRequired,
};
