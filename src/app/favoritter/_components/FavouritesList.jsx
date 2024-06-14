"use client";

import React, { useState } from "react";
import { HStack, Select, Heading, VStack } from "@navikt/ds-react";
import PropTypes from "prop-types";
import AlertModalWithPageReload from "@/app/_common/components/modals/AlertModalWithPageReload";
import useToggle from "@/app/_common/hooks/useToggle";
import { useRouter, useSearchParams } from "next/navigation";
import FavouritesListItem from "./FavouritesListItem";
import NoFavourites from "./NoFavourites";

function FavouritesList({ favourites }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [locallyRemovedUuids, setLocallyRemovedUuids] = useState([]);
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle();

    // eslint-disable-next-line
    favourites = favourites.filter((it) => !locallyRemovedUuids.includes(it.uuid));

    function onFavouriteDeleted(uuid) {
        setLocallyRemovedUuids([...locallyRemovedUuids, uuid]);
    }

    function onSortChange(e) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("sort", e.target.value);
        router.replace(`/favoritter?${newSearchParams.toString()}`);
    }

    if (favourites.length === 0) {
        return <NoFavourites />;
    }

    return (
        <div>
            <section className="container-medium mt-10 mb-24">
                <HStack gap="4" align="center" justify="space-between" className="mb-12">
                    <Heading level="1" size="xlarge">
                        Favoritter
                    </Heading>
                    <Select
                        onChange={onSortChange}
                        value={searchParams.get("sort") || "published"}
                        name="sortBy"
                        label="Sorter etter"
                        className="inline-select"
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
                    {favourites &&
                        favourites.map((favourite) => (
                            <FavouritesListItem
                                key={favourite.uuid}
                                favourite={favourite}
                                onFavouriteDeleted={onFavouriteDeleted}
                                openErrorDialog={openErrorDialog}
                            />
                        ))}
                </VStack>

                {shouldShowErrorDialog && (
                    <AlertModalWithPageReload id="favourites-list-item-error" onClose={closeErrorDialog} title="Feil">
                        Det oppsto en feil ved dine favoritter. Prøv å last siden på nytt
                    </AlertModalWithPageReload>
                )}
            </section>
        </div>
    );
}

FavouritesList.propTypes = {
    favourites: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FavouritesList;
