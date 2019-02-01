import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { CONTEXT_PATH } from '../../fasitProperties';
import ToggleFavouriteStar from '../../favourites/toggleFavoriteButton/ToggleFavouriteStar';
import {formatISOString, isValidISOString} from '../../utils';
import getWorkLocation from '../../common/getWorkLocation';
import getEmployer from '../../common/getEmployer';
import './SearchResultsItemCompact.less';

export default function SearchResultsItemCompact({ stilling, urlQuery }) {
    let frist;
    const { applicationdue } = stilling.properties;
    if (applicationdue && applicationdue !== undefined) {
        frist = isValidISOString(applicationdue) ? formatISOString(applicationdue, 'DD.MM.YYYY') : applicationdue;
    } else {
        frist = 'Ikke oppgitt';
    }
    const employer = getEmployer(stilling);
    return (
        <div className="SearchResultItemCompact">
            {employer && (
                <Normaltekst className="SearchResultItemCompact__employer">
                    {employer} - {getWorkLocation(stilling, true)}
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
            { frist && (
                <Undertekst className="SearchResultItem__updated">
                    {frist}
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
            applicationdue: PropTypes.string
        })
    }).isRequired,
    shouldFocus: PropTypes.bool,
    urlQuery: PropTypes.string
};
