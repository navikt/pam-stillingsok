import { FaceFrownIcon, FaceSmileIcon } from '@navikt/aksel-icons';
import { FeedbackButton } from '@navikt/arbeidsplassen-react';
import {
  Link as AkselLink, BodyLong, HStack, Heading, Panel, VStack,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import logAmplitudeEvent from '@/app/_common/monitoring/amplitude';

const Feedback = ({ query }) => {
  const [hasGivenRating, setHasGiverRating] = useState(false);

  const onRatingClick = (text) => {
    try {
      logAmplitudeEvent('rate search result relevance', {
        rating: text,
        hasSearchString: query.q && query.q.length > 0,
        hasSearchFields: query.fields && query.fields.length > 0,
      });
    } catch (err) {
      // ignore
    }
    setHasGiverRating(true);
  };

  return (
    <Panel className="text-center" id="feedback-panel">
      <VStack gap="2">
        <Heading id="feedback-panel-title" level="2" size="small">
          Synes du søketreffene er relevante?
        </Heading>
        {!hasGivenRating ? (
          <HStack gap="2" justify="center">
            <FeedbackButton
              aria-describedby="feedback-panel-title"
              icon={<FaceSmileIcon aria-hidden="true" fontSize="1.5rem" />}
              onClick={() => onRatingClick('Ja')}
            >
              Ja
            </FeedbackButton>
            <FeedbackButton
              aria-describedby="feedback-panel-title"
              icon={<FaceFrownIcon aria-hidden="true" fontSize="1.5rem" />}
              onClick={() => onRatingClick('Nei')}
            >
              Nei
            </FeedbackButton>
          </HStack>
        ) : (
          <BodyLong weight="semibold">Takk for tilbakemeldingen!</BodyLong>
        )}

        <BodyLong>Er det noe du savner eller synes kunne vært bedre, så vil vi gjerne høre det.</BodyLong>

        <BodyLong>
          <AkselLink href="https://surveys.hotjar.com/8eedca7e-3fae-4852-8d96-4c9c80424cdc">
            Skriv en kort tilbakemelding
          </AkselLink>
        </BodyLong>
      </VStack>
    </Panel>
  );
};

Feedback.propTypes = {
  query: PropTypes.shape({
    q: PropTypes.string,
    fields: PropTypes.string,
  }).isRequired,
};

export default Feedback;
