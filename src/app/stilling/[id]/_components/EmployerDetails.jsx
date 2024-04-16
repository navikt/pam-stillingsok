import { RichText } from '@navikt/arbeidsplassen-react';
import {
  Link as AkselLink, BodyLong, Heading, Label,
} from '@navikt/ds-react';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import React from 'react';

export default function EmployerDetails({ employer }) {
  return (
    <section className="mt-8 mb-8">
      <Heading spacing level="2" size="large">
        Om bedriften
      </Heading>
      {employer.description ? <RichText className="job-posting-text mt-4">{parse(employer.description)}</RichText> : null}
      <dl className="ad-description-list">
        {employer.sector ? (
          <div>
            <dt>
              <Label as="p">Sektor</Label>
            </dt>
            <dd>
              <BodyLong>{employer.sector}</BodyLong>
            </dd>
          </div>
        ) : null}
        {employer.homepage ? (
          <div>
            <dt>
              <Label as="p">Nettsted</Label>
            </dt>
            <dd>
              <BodyLong>
                {employer.homepage.url ? (
                  <AkselLink href={employer.homepage.url}>{employer.homepage.url}</AkselLink>
                ) : (
                  employer.homepage.dangerouslyInvalidUrl
                )}
              </BodyLong>
            </dd>
          </div>
        ) : null}
        {employer.linkedinPage ? (
          <div>
            <dt>
              <Label as="p">LinkedIn</Label>
            </dt>
            <dd>
              <BodyLong>
                {employer.linkedinPage.url ? (
                  <AkselLink href={employer.linkedinPage.url}>{employer.linkedinPage.url}</AkselLink>
                ) : (
                  employer.linkedinPage.dangerouslyInvalidUrl
                )}
              </BodyLong>
            </dd>
          </div>
        ) : null}
        {employer.twitterAddress ? (
          <div>
            <dt>
              <Label as="p">Twitter</Label>
            </dt>
            <dd>
              <BodyLong>
                {employer.twitterAddress.url ? (
                  <AkselLink href={employer.twitterAddress.url}>
                    {employer.twitterAddress.url}
                  </AkselLink>
                ) : (
                  employer.twitterAddress.dangerouslyInvalidUrl
                )}
              </BodyLong>
            </dd>
          </div>
        ) : null}
        {employer.facebookPage ? (
          <div>
            <dt>
              <Label as="p">Facebook</Label>
            </dt>
            <dd>
              <BodyLong>
                {employer.facebookPage.url ? (
                  <AkselLink href={employer.facebookPage.url}>{employer.facebookPage.url}</AkselLink>
                ) : (
                  employer.facebookPage.dangerouslyInvalidUrl
                )}
              </BodyLong>
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

EmployerDetails.propTypes = {
  employer: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    locationList: PropTypes.array,
    sector: PropTypes.string,
    homepage: PropTypes.shape({
      url: PropTypes.string,
      dangerouslyInvalidUrl: PropTypes.string,
    }),
    linkedinPage: PropTypes.shape({
      url: PropTypes.string,
      dangerouslyInvalidUrl: PropTypes.string,
    }),
    twitterAddress: PropTypes.shape({
      url: PropTypes.string,
      dangerouslyInvalidUrl: PropTypes.string,
    }),
    facebookPage: PropTypes.shape({
      url: PropTypes.string,
      dangerouslyInvalidUrl: PropTypes.string,
    }),
  }).isRequired,
};
