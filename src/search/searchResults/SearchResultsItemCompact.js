import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { CONTEXT_PATH } from '../../fasitProperties';
import ToggleFavouriteStar from '../../favourites/toggleFavoriteButton/ToggleFavouriteStar';
import { formatISOString } from '../../utils';
import './SearchResultsItemCompact.less';

export default function SearchResultsItemCompact({ stilling, urlQuery }) {
    return (
        <div className="SearchResultItemCompact">
            {stilling.properties.employer && (
                <Normaltekst className="SearchResultItemCompact__employer">
                    {stilling.properties.employer} - {stilling.properties.location}
                </Normaltekst>
            )}

            <Normaltekst tag="h3" className="SearchResultItemCompact__title">
                <Link to={`${CONTEXT_PATH}/stilling/${stilling.uuid}${urlQuery}`} className="lenke SearchResultItemCompact__title__ellipsis">
                    {stilling.properties.jobtitle && stilling.title !== stilling.properties.jobtitle ? (
                        <span>
                            <b>{stilling.properties.jobtitle}</b> - {stilling.title}
                        </span>
                    ) : (
                        <b>{stilling.title}</b>
                    )
                    }
                </Link>
            </Normaltekst>
            {stilling.updated && (
                <Undertekst className="SearchResultItem__updated">
                    {formatISOString(stilling.updated, 'DD.MM.YYYY')}
                </Undertekst>
            )}
            <ToggleFavouriteStar uuid={stilling.uuid} className="SearchResultItemCompact__favourite"/>
        </div>
    );
}

SearchResultsItemCompact.defaultProps = {
    shouldFocus: false,
    urlQuery: ''
};

SearchResultsItemCompact.propTypes = {
    stilling: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
        properties: PropTypes.shape({
            employer: PropTypes.string,
            jobtitle: PropTypes.string,
            location: PropTypes.string,
            updated: PropTypes.string
        })
    }).isRequired,
    shouldFocus: PropTypes.bool,
    urlQuery: PropTypes.string
};
