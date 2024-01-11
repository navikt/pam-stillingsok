import React from "react";
import { HStack, Select, Heading } from "@navikt/ds-react";
import PropTypes from "prop-types";
import { FetchAction } from "../../common/hooks/useFetchReducer";
import FavouritesListItem from "./FavouritesListItem";

function FavouritesList({ data, dispatch, sortBy, setSortBy }) {
    /**
     * If user deleted a favourite, remove it from the local data,
     * instead of re-loading all favourites from backend
     */
    function removeFavouriteFromList(removed) {
        dispatch({
            type: FetchAction.SET_DATA,
            data: (prevState) => prevState.filter((it) => it.favouriteAd.uuid !== removed.favouriteAd.uuid),
        });
    }

    return (
        <section className="container-medium mt-16 mb-16">
            <HStack gap="4" align="center" justify="space-between" className="mb-12">
                <Heading level="1" size="xlarge" spacing={false}>
                    Favoritter
                </Heading>

                <Select
                    onChange={(e) => {
                        setSortBy(e.target.value);
                    }}
                    value={sortBy}
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
            <div>
                {data.map((favourite) => (
                    <FavouritesListItem
                        key={favourite.uuid}
                        favourite={favourite}
                        removeFavouriteFromList={removeFavouriteFromList}
                        onRemoved={removeFavouriteFromList}
                    />
                ))}
            </div>
        </section>
    );
}

FavouritesList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    dispatch: PropTypes.func.isRequired,
    setSortBy: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
};

export default FavouritesList;
