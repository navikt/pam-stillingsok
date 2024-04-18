import {
  Hide, Pagination, Select, Show, VStack,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import { ALLOWED_NUMBER_OF_RESULTS_PER_PAGE, SEARCH_CHUNK_SIZE } from '../../_utils/query';
import { SET_FROM_AND_SIZE } from '../../_utils/queryReducer';

function SearchPagination({ searchResult, query, queryDispatch }) {
  const resultsPerPage = query.size || SEARCH_CHUNK_SIZE;

  // Elastic search does not allow pagination above 10 000 results.
  const totalPages = Math.ceil(
    searchResult.totalAds < 10000 ? searchResult.totalAds / resultsPerPage : 9999 / resultsPerPage,
  );
  const page = query.from ? Math.floor(query.from / resultsPerPage) + 1 : 1;

  const onPageChange = (x) => {
    queryDispatch({
      type: SET_FROM_AND_SIZE,
      from: x * resultsPerPage - resultsPerPage,
      size: resultsPerPage,
    });
  };

  if (totalPages === 0) {
    return null;
  }

  return (
    <VStack align="center" gap="10">
      <Show above="md">
        <Pagination
          prevNextTexts
          aria-label="Navigasjon mellom søketreff"
          boundaryCount={1}
          count={totalPages}
          page={page}
          siblingCount={1}
          onPageChange={onPageChange}
        />
      </Show>
      <Hide above="md">
        <Pagination
          aria-label="Navigasjon mellom søketreff"
          boundaryCount={1}
          count={totalPages}
          page={page}
          siblingCount={0}
          size="small"
          onPageChange={onPageChange}
        />
      </Hide>
      <Select
        className="inline-select"
        label="Antall treff per side"
        value={resultsPerPage}
        onChange={(e) => {
          queryDispatch({
            type: SET_FROM_AND_SIZE,
            from: 0,
            size: parseInt(e.target.value, 10),
          });
        }}
      >
        {ALLOWED_NUMBER_OF_RESULTS_PER_PAGE.map((item) => (
          <option key={`page-${item}`} value={item}>
            {item}
          </option>
        ))}
      </Select>
    </VStack>
  );
}

SearchPagination.propTypes = {
  searchResult: PropTypes.shape({
    ads: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  query: PropTypes.shape({
    from: PropTypes.number,
  }),
  queryDispatch: PropTypes.func.isRequired,
};

export default SearchPagination;
