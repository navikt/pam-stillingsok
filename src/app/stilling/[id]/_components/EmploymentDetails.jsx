import {
  BodyLong, HStack, Heading, Label,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import { formatDate } from '@/app/_common/utils/utils';
import './AdDescriptionList.css';
import joinStringWithSeperator from '@/app/_common/utils/joinStringWithSeperator';
import FavouritesButton from '@/app/favoritter/_components/FavouritesButton';

import { RichText } from '@navikt/arbeidsplassen-react';
import parse from 'html-react-parser';

export default function EmploymentDetails({ adData }) {
  /**
     *  TODO: refactor denne
     *  Blir brukt for FavouritesButton som forventer gammeldags data.
     *  Venter med å refaktorere FavouritesButton for den blir brukt
     *  flere steder
     */
  const stilling = {
    source: adData.source,
    reference: adData.reference,
    title: adData.title,
    status: adData.status,
    locationList: adData.locationList,
    published: adData.published,
    expires: adData.expires,
    properties: {
      jobtitle: adData.jobTitle,
      applicationdue: adData.applicationDue,
      location: adData.location,
      employer: adData.employer.name,
    },
  };

  const options = {

    replace: ({ attribs }) => {
      if (
        attribs
                && (attribs.id === 'arb-serEtter' || attribs.id === 'arb-arbeidsoppgaver' || attribs.id === 'arb-tilbyr')
      ) {
        return null;
      }
    },
  };

  return (
    <section className="full-width mt-8">
      <HStack align="center" className="mb-8" gap="4" justify="space-between">
        <Heading level="2" size="large">
          Om jobben
        </Heading>
        <FavouritesButton id={adData.id} stilling={stilling} variant="tertiary" />
      </HStack>

      {adData.adText && adData.adText.includes('arb-aapningstekst') ? <RichText>{parse(adData.adText, options)}</RichText> : null}

      <dl className="ad-description-list mb-8">
        {adData.jobTitle ? (
          <div>
            <dt>
              <Label as="p">Stillingstittel</Label>
            </dt>
            <dd>
              <BodyLong>{adData.jobTitle}</BodyLong>
            </dd>
          </div>
        ) : null}
        {adData.startTime ? (
          <div>
            <dt>
              <Label as="p">Oppstart</Label>
            </dt>
            <dd>
              <BodyLong>{formatDate(adData.startTime)}</BodyLong>
            </dd>
          </div>
        ) : null}
        {adData.engagementType ? (
          <div>
            <dt>
              <Label as="p">Type ansettelse</Label>
            </dt>
            <dd>
              <BodyLong>
                {adData.engagementType}
                {adData.extent ? `, ${adData.extent}` : ''}
              </BodyLong>
            </dd>
          </div>
        ) : null}
        {(adData.jobArrangement || adData.workdays || adData.workHours) ? (
          <div>
            <dt>
              <Label as="p">Arbeidstid</Label>
            </dt>
            <dd>
              <BodyLong>
                {adData.jobArrangement}
                {' '}
                {adData.workdays}
                {' '}
                {adData.workHours}
              </BodyLong>
            </dd>
          </div>
        ) : null}
        {adData.jobArrangement ? (
          <div>
            <dt>
              <Label as="p">Arbeidstidsordning</Label>
            </dt>
            <dd>
              <BodyLong>{adData.jobArrangement}</BodyLong>
            </dd>
          </div>
        ) : null}
        {adData.workLanguages ? (
          <div>
            <dt>
              <Label as="p">Arbeidsspråk</Label>
            </dt>
            <dd>
              <BodyLong>{joinStringWithSeperator(adData.workLanguages, 'eller')}</BodyLong>
            </dd>
          </div>
        ) : null}
        {adData.positionCount ? (
          <div>
            <dt>
              <Label as="p">Antall stillinger</Label>
            </dt>
            <dd>
              <BodyLong>{adData.positionCount}</BodyLong>
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

EmploymentDetails.propTypes = {
  adData: PropTypes.shape({
    jobTitle: PropTypes.string,
    positionCount: PropTypes.string,
    startTime: PropTypes.string,
    engagementType: PropTypes.string,
    jobPercentage: PropTypes.string,
    extent: PropTypes.string,
    workdays: PropTypes.string,
    workHours: PropTypes.string,
    jobArrangement: PropTypes.string,
    workLanguages: PropTypes.array,
    employer: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
};
