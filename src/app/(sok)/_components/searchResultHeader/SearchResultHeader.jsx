import {
  BodyShort, Box, HGrid, Heading, Stack,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import Sorting from '@/app/(sok)/_components/searchResult/Sorting';
import { formatNumber } from '@/app/_common/utils/utils';

const SearchResultHeader = ({ searchResult, query, queryDispatch }) => {
  const annonserWord = searchResult.totalAds === 1 ? 'annonse' : 'annonser';
  const stillingerWord = searchResult.totalPositions === 1 ? 'stilling' : 'stillinger';

  return (
    <Box background="surface-alt-1-subtle" paddingBlock="4">
      <HGrid
        className="container-large"
        columns={{ xs: 1, lg: '220px auto', xl: '370px auto' }}
        gap={{ xs: '0', lg: '6', xl: '12' }}
      >
        <div />
        <Stack
          align={{ sm: 'flex-start', md: 'center' }}
          direction={{ xs: 'column', md: 'row' }}
          gap="4 8"
          justify={{ md: 'space-between' }}
          wrap={false}
        >
          <div>
            <Heading className="mb-1" level="2" size="small">
              Søkeresultat
            </Heading>
            <BodyShort role="status">
              {searchResult.totalAds === 0
                ? 'Ingen treff'
                : `${formatNumber(searchResult.totalPositions)} ${stillingerWord} i ${formatNumber(
                  searchResult.totalAds,
                )} ${annonserWord}`}
            </BodyShort>
          </div>
          <Sorting dispatch={queryDispatch} query={query} />
        </Stack>
      </HGrid>
    </Box>
  );
};

SearchResultHeader.propTypes = {
  searchResult: PropTypes.shape({
    totalAds: PropTypes.number,
    totalPositions: PropTypes.number,
  }),
  queryDispatch: PropTypes.func.isRequired,
  query: PropTypes.shape({}),
};

export default SearchResultHeader;
