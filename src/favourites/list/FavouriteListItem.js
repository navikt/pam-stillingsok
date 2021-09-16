import classNames from 'classnames';
import AlertStripe from 'nav-frontend-alertstriper';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { Flatknapp } from '@navikt/arbeidsplassen-knapper';
import '../../common/components/Icons.less';
import SearchResultsItemDetails from '../../search/searchResults/SearchResultsItemDetails';
import ConfirmationModal from '../../common/components/ConfirmationModal';
import { FavouritesContext } from '../FavouritesProvider';

export default function FavouriteListItem ({ favourite }) {
    const { removeFavourite, isPending } = useContext(FavouritesContext);

    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const expired = favourite.favouriteAd.status !== 'ACTIVE';

    const onRemoveClick = () => {
        setShowDeleteConfirmationModal(true);
    };

    const onDeleteCanceled = () => {
        setShowDeleteConfirmationModal(false);
    };

    const onDeleteConfirmed = () => {
        removeFavourite(favourite.favouriteAd.uuid);
    };

    const toAd = (favourite) => ({
        uuid: favourite.uuid,
        title: favourite.title,
        published: favourite.published,
        source: favourite.source,
        reference: favourite.reference,
        properties: {
            employer: favourite.employer,
            jobtitle: favourite.jobTitle,
            location: favourite.location,
            applicationdue: favourite.applicationdue
        }
    });


    return (
        <div className="FavouriteListItem__wrapper">
            <div className={classNames('FavouriteListItem', {'FavouriteListItem--expired': expired})}>
                <SearchResultsItemDetails stilling={toAd(favourite.favouriteAd)}/>
                <Flatknapp
                    onClick={onRemoveClick}
                    className="FavouriteListItem__delete Delete"
                    aria-label="Slett"
                    disabled={isPending}
                >
                    <span className="Delete__icon"/>
                    Slett
                </Flatknapp>

                {expired && (
                    <AlertStripe type="advarsel" className="FavouriteListItem__alertstripe alertstripe--solid">
                        Denne annonsen er utløpt
                    </AlertStripe>
                )}
            </div>

            {showDeleteConfirmationModal && (
                <ConfirmationModal
                    title="Slett favoritt"
                    onConfirm={onDeleteConfirmed}
                    onCancel={onDeleteCanceled}
                    confirmLabel="Slett"
                    spinner={isPending}
                >
                    Er du sikker på at du vil slette &#34;{favourite.favouriteAd.title}&#34;?
                </ConfirmationModal>
            )}
        </div>
    );
}

FavouriteListItem.propTypes = {
    favourite: PropTypes.shape({
        uuid: PropTypes.string,
        favouriteAd: PropTypes.shape({
            status: PropTypes.string
        })
    }).isRequired
};
