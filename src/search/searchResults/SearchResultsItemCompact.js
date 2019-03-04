import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { CONTEXT_PATH } from '../../fasitProperties';
import ToggleFavouriteStar from '../../favourites/toggleFavoriteButton/ToggleFavouriteStar';
import { formatISOString, isValidISOString } from '../../utils';
import getWorkLocation from '../../common/getWorkLocation';
import getEmployer from '../../common/getEmployer';
import './SearchResultsItemCompact.less';

export default function SearchResultsItemCompact({ stilling, urlQuery }) {
    let frist;
    const { applicationdue } = stilling.properties;
    if (applicationdue && applicationdue !== undefined) {
        frist = isValidISOString(applicationdue) ? formatISOString(applicationdue, 'DD.MM.YYYY') : applicationdue;
    } else {
        frist = '';
    }
    const employer = getEmployer(stilling);
    return (
        <div className="SearchResultItemCompact">
            <Link to={`${CONTEXT_PATH}/stilling/${stilling.uuid}${urlQuery}`} className="SearchResultItemCompact__flex">
                <Undertekst className="SearchResultItemCompact__flex__employer">
                    {employer || ''}
                </Undertekst>
                <div className="SearchResultItemCompact__flex__title">
                    <Normaltekst tag="h3" className="SearchResultItemCompact__flex__title__h3">
                        {stilling.title}
                    </Normaltekst>
                    <Undertekst className="SearchResultItemCompact__flex__title__details">
                        {stilling.properties.jobtitle && stilling.title !== stilling.properties.jobtitle && (
                            <span className="SearchResultItemCompact__flex__title__details__jobTitle">
                                {stilling.properties.jobtitle}{' - '}
                            </span>
                        )}
                        <span>
                            {getWorkLocation(stilling, true)}
                        </span>
                        {frist !== '' && (
                            <span>
                                {' - '}Frist: {frist}
                            </span>
                        )}
                    </Undertekst>
                </div>
            </Link>
            <div className="SearchResultItemCompact__favourite">
                <ToggleFavouriteStar uuid={stilling.uuid} className="SearchResultItemCompact__favourite" />
            </div>
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
            applicationdue: PropTypes.string
        })
    }).isRequired,
    shouldFocus: PropTypes.bool,
    urlQuery: PropTypes.string
};
