import { Button, HStack, Heading } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import FacebookIcon from './icons/FacebookIcon';
import LinkedinIcon from './icons/LinkedinIcon';
import TwitterIcon from './icons/TwitterIcon';

export default function ShareAd({ adData }) {
  const shareAdRedirectUrl = `https://arbeidsplassen.nav.no/stillinger/stilling/${adData.id}`;

  return (
    <section className="full-width mb-10">
      <Heading spacing level="2" size="medium">
        Del annonsen
      </Heading>
      <HStack gap="4">
        <Button
          as="a"
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareAdRedirectUrl}`}
          icon={<FacebookIcon />}
          rel="noopener noreferrer"
          variant="secondary"
        />
        <Button
          as="a"
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareAdRedirectUrl}`}
          icon={<LinkedinIcon />}
          rel="noopener noreferrer"
          variant="secondary"
        />
        <Button
          as="a"
          href={`https://twitter.com/intent/tweet?url=${shareAdRedirectUrl}&text=${encodeURI(adData.title)}`}
          icon={<TwitterIcon />}
          rel="noopener noreferrer"
          variant="secondary"
        />
      </HStack>
    </section>
  );
}

ShareAd.propTypes = {
  adData: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};
