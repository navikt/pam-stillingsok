import { Buldings3Icon, LocationPinIcon } from '@navikt/aksel-icons';
import {
  Link as AkselLink, BodyShort, HStack, Heading, Tag, VStack,
} from '@navikt/ds-react';
import {
  endOfDay, isSameDay, parseISO, subDays,
} from 'date-fns';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import deadlineText from '@/app/_common/utils/deadlineText';
import getEmployer from '@/app/_common/utils/getEmployer';
import getWorkLocation from '@/app/_common/utils/getWorkLocation';
import { formatDate } from '@/app/_common/utils/utils';

import Debug from './Debug';

export default function SearchResultItem({
  ad, showExpired, favouriteButton, isDebug,
}) {
  const location = getWorkLocation(ad.properties.location, ad.locationList);
  const employer = getEmployer(ad);
  const published = formatDate(ad.published);
  const hasInterestform = ad.properties.hasInterestform && ad.properties.hasInterestform === 'true';
  const jobTitle = ad.properties.jobtitle && ad.title !== ad.properties.jobtitle ? ad.properties.jobtitle : undefined;
  const frist = ad.properties.applicationdue ? formatDate(ad.properties.applicationdue) : undefined;
  const now = new Date();
  const isPublishedToday = isSameDay(endOfDay(now), endOfDay(parseISO(ad.published)));
  const isPublishedYesterday = isSameDay(endOfDay(subDays(now, 1)), endOfDay(parseISO(ad.published)));
  const isPublishedTwoDaysAgo = isSameDay(endOfDay(subDays(now, 2)), endOfDay(parseISO(ad.published)));

  return (
    <HStack
      aria-label={`${ad.title}, ${employer}, ${location}`}
      as="article"
      gap="3"
      justify="space-between"
      wrap={false}
    >
      <VStack gap="3">
        <VStack gap="1">
          {published ? (
            <BodyShort suppressHydrationWarning size="small" textColor="subtle" weight="semibold">
              {isPublishedToday ? 'Ny i dag' : null}
              {isPublishedYesterday ? 'I går' : null}
              {isPublishedTwoDaysAgo ? 'To dager siden' : null}
              {!isPublishedToday && !isPublishedYesterday && !isPublishedTwoDaysAgo && published}
            </BodyShort>
          ) : null}
          <HStack align="center" gap="2" justify="space-between" wrap={false}>
            <Heading className="overflow-wrap-anywhere" level="3" size="small">
              <LinkToAd employer={employer} stilling={ad}>
                {ad.title}
              </LinkToAd>
            </Heading>
          </HStack>
          {jobTitle ? (
            <BodyShort className="overflow-wrap-anywhere" weight="semibold">
              {jobTitle}
            </BodyShort>
          ) : null}
        </VStack>

        <VStack gap="1">
          {employer ? (
            <HStack align="center" gap="2" wrap={false}>
              <VStack align="center">
                <Buldings3Icon aria-hidden="true" fontSize="1.5rem" />
                <BodyShort visuallyHidden>Arbeidsgiver</BodyShort>
              </VStack>
              <BodyShort className="overflow-wrap-anywhere">{employer}</BodyShort>
            </HStack>
          ) : null}
          {location ? (
            <HStack align="center" gap="2" wrap={false}>
              <VStack align="center">
                <LocationPinIcon aria-hidden="true" aria-label="Sted" fontSize="1.5rem" />
                <BodyShort visuallyHidden>Sted</BodyShort>
              </VStack>
              <BodyShort className="overflow-wrap-anywhere">{location}</BodyShort>
            </HStack>
          ) : null}
        </VStack>

        <HStack align="center" gap="4">
          {showExpired ? (
            <Tag size="small" variant="warning-moderate">
              Annonsen er utløpt
            </Tag>
          ) : null}
          {hasInterestform ? (
            <Tag size="small" variant="info-moderate">
              Superrask søknad
            </Tag>
          ) : null}
          {frist ? (
            <BodyShort suppressHydrationWarning size="small" textColor="subtle" weight="semibold">
              {deadlineText(frist, now, ad.properties.applicationdue)}
            </BodyShort>
          ) : null}
        </HStack>

        {isDebug ? <Debug ad={ad} /> : null}
      </VStack>
      <div className="mt-4">{favouriteButton}</div>
    </HStack>
  );
}

SearchResultItem.propTypes = {
  ad: PropTypes.shape({
    uuid: PropTypes.string,
    source: PropTypes.string,
    title: PropTypes.string,
    published: PropTypes.string,
    properties: PropTypes.shape({
      employer: PropTypes.string,
      hasInterestform: PropTypes.string,
      jobtitle: PropTypes.string,
      location: PropTypes.string,
      applicationdue: PropTypes.string,
    }),
    locationList: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  showExpired: PropTypes.bool,
  favouriteButton: PropTypes.node,
  isDebug: PropTypes.bool,
};

const LinkToAd = ({ children, stilling }) => (
  <AkselLink as={Link} href={`/stilling/${stilling.uuid}`}>
    {children}
  </AkselLink>
);

LinkToAd.propTypes = {
  children: PropTypes.node,
  stilling: PropTypes.shape({
    reference: PropTypes.string,
    uuid: PropTypes.string,
  }),
};
