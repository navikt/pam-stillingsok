'use client';

import {
  HStack, Heading, Select, VStack,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import AlertModalWithPageReload from '@/app/_common/components/modals/AlertModalWithPageReload';
import useToggle from '@/app/_common/hooks/useToggle';

import FavouritesListItem from './FavouritesListItem';
import NoFavourites from './NoFavourites';

const FavouritesList = ({ favourites }) => {
  const [sortBy, setSortBy] = useState('published');
  const [locallyRemovedUuids, setLocallyRemovedUuids] = useState([]);
  const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle();

  if (sortBy === 'published') {
    favourites.sort((a, b) => b.favouriteAd.published.localeCompare(a.favouriteAd.published));
  } else if (sortBy === 'expires') {
    favourites.sort((a, b) => a.favouriteAd.expires.localeCompare(b.favouriteAd.expires));
  }

  // eslint-disable-next-line
    favourites = favourites.filter((it) => !locallyRemovedUuids.includes(it.uuid));

  function onFavouriteDeleted(uuid) {
    setLocallyRemovedUuids([...locallyRemovedUuids, uuid]);
  }

  if (favourites.length === 0) {
    return <NoFavourites />;
  }

  return (
    <div>
      <section className="container-medium mt-10 mb-24">
        <HStack align="center" className="mb-12" gap="4" justify="space-between">
          <Heading level="1" size="xlarge">
            Favoritter
          </Heading>
          <Select
            className="inline-select"
            label="Sorter etter"
            name="sortBy"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
            }}
          >
            <option key="published" value="published">
              Vis nyeste øverst
            </option>
            <option key="expires" value="expires">
              Søknadsfrist
            </option>
          </Select>
        </HStack>
        <VStack gap="10">
          {favourites ? favourites.map((favourite) => (
            <FavouritesListItem
              key={favourite.uuid}
              favourite={favourite}
              openErrorDialog={openErrorDialog}
              onFavouriteDeleted={onFavouriteDeleted}
            />
          )) : null}
        </VStack>

        {shouldShowErrorDialog ? (
          <AlertModalWithPageReload id="favourites-list-item-error" title="Feil" onClose={closeErrorDialog}>
            Det oppsto en feil ved dine favoritter. Prøv å last siden på nytt
          </AlertModalWithPageReload>
        ) : null}
      </section>
    </div>
  );
};

FavouritesList.propTypes = {
  favourites: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FavouritesList;
