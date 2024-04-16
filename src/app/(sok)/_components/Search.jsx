'use client';

import {
  Box, Button, HGrid, HStack, Heading, Hide, Show, Stack, VStack,
} from '@navikt/ds-react';
import { useRouter, useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { useEffect, useReducer, useState } from 'react';

import logAmplitudeEvent from '../../_common/monitoring/amplitude';
import {
  SEARCH_CHUNK_SIZE, isSearchQueryEmpty, stringifyQuery, toBrowserQuery,
} from '../_utils/query';
import queryReducer from '../_utils/queryReducer';

import Feedback from './feedback/Feedback';
import FiltersDesktop from './filters/FiltersDesktop';
import FiltersMobile from './filters/FiltersMobile';
import DoYouWantToSaveSearch from './howToPanels/DoYouWantToSaveSearch';
import FilterIcon from './icons/FilterIcon';
import LoggedInButtons from './loggedInButtons/LoggedInButtons';
import SearchBox from './searchBox/SearchBox';
import MaxResultsBox from './searchResult/MaxResultsBox';
import SearchPagination from './searchResult/SearchPagination';
import SearchResult from './searchResult/SearchResult';
import SearchResultHeader from './searchResultHeader/SearchResultHeader';
import SelectedFilters from './selectedFilters/SelectedFilters';

export default function Search({
  query, searchResult, aggregations, locations,
}) {
  const [updatedQuery, queryDispatch] = useReducer(queryReducer, query);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [initialRenderDone, setInitialRenderDone] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const savedSearchUuid = searchParams.get('saved');

  /**
     * Perform a search when user changes search criteria
     */
  useEffect(() => {
    if (initialRenderDone) {
      const browserQuery = toBrowserQuery(updatedQuery);

      // Keep saved search uuid in browser url, as long as there are some search criteria.
      // This uuid is used when user update an existing saved search
      if (!isSearchQueryEmpty(browserQuery) && savedSearchUuid) {
        browserQuery.saved = savedSearchUuid;
      }

      logAmplitudeEvent('Stillinger - Utførte søk');

      if (updatedQuery.paginate) {
        router.push(`/${stringifyQuery(browserQuery)}`);
      } else {
        router.replace(`/${stringifyQuery(browserQuery)}`, { scroll: false });
      }
    } else {
      // Skip search first time query change, since that
      // will just reload the search result we already got
      setInitialRenderDone(true);
    }
  }, [updatedQuery]);

  useEffect(() => {
    logAmplitudeEvent('Stillinger - Utførte søk');
  }, []);

  function onFormSubmit(e) {
    e.preventDefault();
  }

  return (
    <form className="mb-24" onSubmit={onFormSubmit}>
      <Box paddingBlock={{ xs: '4', md: '10' }} paddingInline={{ xs: '4', sm: '6' }}>
        <Stack justify={{ md: 'center' }}>
          <Heading level="1" size="xlarge">
            Søk etter din neste jobb
          </Heading>
        </Stack>
      </Box>

      <div className="container-small">
        <SearchBox dispatch={queryDispatch} query={updatedQuery} />
        <Box paddingBlock={{ xs: '0 4', md: '0 12' }}>
          <HStack align={{ xs: 'start', md: 'center' }} gap="2" justify={{ xs: 'start', md: 'center' }}>
            <Show below="lg">
              <Button
                aria-expanded={isFiltersVisible}
                icon={<FilterIcon />}
                variant="tertiary"
                onClick={() => {
                  setIsFiltersVisible(!isFiltersVisible);
                }}
              >
                Velg sted, yrke og andre filtre
              </Button>
            </Show>

            <LoggedInButtons />
          </HStack>
        </Box>
      </div>

      <SearchResultHeader
        isFiltersVisible={isFiltersVisible}
        query={updatedQuery}
        queryDispatch={queryDispatch}
        searchResult={searchResult}
      />

      <HGrid
        className="container-large mt-8"
        columns={{ xs: 1, lg: '220px auto', xl: '370px auto' }}
        gap={{ xs: '0', lg: '6', xl: '12' }}
      >
        <Hide below="lg">
          <FiltersDesktop
            aggregations={aggregations}
            dispatchQuery={queryDispatch}
            locations={locations}
            query={updatedQuery}
            searchResult={searchResult}
          />
        </Hide>

        <Show below="lg">
          {isFiltersVisible ? (
            <FiltersMobile
              aggregations={aggregations}
              dispatchQuery={queryDispatch}
              locations={locations}
              query={updatedQuery}
              searchResult={searchResult}
              onCloseClick={() => setIsFiltersVisible(false)}
            />
          ) : null}
        </Show>

        <VStack gap="10">
          <SelectedFilters query={query} queryDispatch={queryDispatch} />
          <SearchResult query={updatedQuery} searchResult={searchResult} />

          {/* Elastic search does not support pagination above 10 000 */}
          {query.from + query.size === 10000 && <MaxResultsBox />}

          <SearchPagination query={query} queryDispatch={queryDispatch} searchResult={searchResult} />

          {query.from + SEARCH_CHUNK_SIZE >= searchResult.totalAds && <DoYouWantToSaveSearch query={query} />}
          <Feedback query={query} />
        </VStack>
      </HGrid>
    </form>
  );
}

Search.propTypes = {
  aggregations: PropTypes.shape({}),
  locations: PropTypes.arrayOf(PropTypes.shape({})),
  searchResult: PropTypes.shape({
    ads: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  query: PropTypes.shape({}),
};
