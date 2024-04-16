import {
  Link as AkselLink, BodyLong, CopyButton, HStack, Heading, Label,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import logAmplitudeEvent from '@/app/_common/monitoring/amplitude';

function logCopyContactInfoEvent(type, id, title) {
  logAmplitudeEvent('copy contact info', { type, id, title });
}

function logClickEmailEvent(id, title) {
  logAmplitudeEvent('click contact info email', { id, title });
}

export default function ContactPerson({ contactList, adId, adTitle }) {
  if (contactList && contactList.length > 0) {
    return (
      <section className="full-width mb-10">
        <Heading level="2" size="medium">
          {contactList.length > 1 ? 'Kontaktpersoner for stillingen' : 'Kontaktperson for stillingen'}
        </Heading>
        {contactList.map((contact) => (
          <div key={`${adId}-contact-name`} className="mt-4">
            {contact.name ? <Label as="p">{contact.name}</Label> : null}
            {contact.title ? <BodyLong>{contact.title}</BodyLong> : null}
            {contact.phone ? (
              <BodyLong>
                <HStack as="span" gap="2" wrap={false}>
                  {contact.phone}
                  <CopyButton
                    copyText={contact.phone}
                    size="xsmall"
                    title="Kopier telefonnummer"
                    variant="action"
                    onActiveChange={(state) => {
                      if (state) logCopyContactInfoEvent('phone', adId, adTitle);
                    }}
                  />
                </HStack>
              </BodyLong>
            ) : null}
            {contact.email ? (
              <BodyLong className="overflow-wrap-anywhere">
                <HStack as="span" gap="2" wrap={false}>
                  <AkselLink
                    href={`mailto:${contact.email}`}
                    rel="nofollow"
                    onClick={() => logClickEmailEvent(adId, adTitle)}
                  >
                    {contact.email}
                  </AkselLink>
                  <CopyButton
                    copyText={contact.email}
                    size="xsmall"
                    title="Kopier e-postadresse"
                    variant="action"
                    onActiveChange={(state) => {
                      if (state) logCopyContactInfoEvent('email', adId, adTitle);
                    }}
                  />
                </HStack>
              </BodyLong>
            ) : null}
          </div>
        ))}
      </section>
    );
  }
  return null;
}

ContactPerson.propTypes = {
  contactList: PropTypes.arrayOf(PropTypes.object),
  adId: PropTypes.string,
  adTitle: PropTypes.string,
};
