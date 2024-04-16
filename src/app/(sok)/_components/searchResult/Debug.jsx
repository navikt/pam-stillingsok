import {
  BodyLong, HStack, Heading, ReadMore,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

const Debug = ({ ad }) => (
  <ReadMore className="mt-2 monospace" header={`score: ${ad.score.toFixed(2)}`}>
    {ad.medium !== '' && (
    <>
      <Heading spacing level="4" size="xsmall">
        ad.medium
      </Heading>
      <HStack className="mb-8" gap="4">
        <BodyLong className="metadata">{ad.medium}</BodyLong>
      </HStack>
    </>
    )}
    {ad.occupationList && ad.occupationList.length > 0 ? (
      <>
        <Heading spacing level="4" size="xsmall">
          ad.occupationList
        </Heading>
        <HStack className="mb-8" gap="4">
          {ad.occupationList ? ad.occupationList.map((occupation) => (
            <BodyLong key={`${occupation.level1}-${occupation.level2}`} className="metadata">
              {occupation.level1}
              :
              {occupation.level2}
            </BodyLong>
          )) : null}
        </HStack>
      </>
    ) : null}

    {ad.categoryList && ad.categoryList.length > 0 ? (
      <>
        <Heading spacing level="4" size="xsmall">
          ad.categoryList
        </Heading>
        <HStack className="mb-8" gap="4">
          {ad.categoryList ? ad.categoryList.map((category) => (
            <BodyLong key={category.id} className="metadata">
              {category.name}
              {' '}
              (
              {category.categoryType}
              )
            </BodyLong>
          )) : null}
        </HStack>
      </>
    ) : null}

    {ad.properties.searchtags && ad.properties.searchtags.length > 0 ? (
      <>
        <Heading spacing level="4" size="xsmall">
          ad.properties.searchtags
        </Heading>

        <HStack className="mb-8" gap="4">
          {ad.properties.searchtags ? ad.properties.searchtags.map((tag) => (
            <BodyLong key={`${tag.label}-${tag.score}`} className="metadata">
              {tag.label}
              {' '}
              (score
              {tag.score}
              )
            </BodyLong>
          )) : null}
        </HStack>
      </>
    ) : null}

    {ad.properties.keywords ? (
      <>
        <Heading spacing level="4" size="xsmall">
          ad.properties.keywords
        </Heading>
        <HStack className="mb-8" gap="4">
          {ad.properties.keywords ? <BodyLong className="metadata">{ad.properties.keywords}</BodyLong> : null}
        </HStack>
      </>
    ) : null}
  </ReadMore>
);

Debug.propTypes = {
  ad: PropTypes.shape({
    medium: PropTypes.string,
    categoryList: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, categoryType: PropTypes.string })),
    occupationList: PropTypes.arrayOf(PropTypes.shape({ level1: PropTypes.string, level2: PropTypes.string })),
    properties: PropTypes.shape({
      keywords: PropTypes.string,
      searchtags: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, score: PropTypes.number })),
    }),
    score: PropTypes.number,
  }),
  score: PropTypes.string,
};

export default Debug;
