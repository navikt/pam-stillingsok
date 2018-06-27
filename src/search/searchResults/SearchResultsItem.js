import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Column } from 'nav-frontend-grid';
import { Undertittel, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { formatISOString } from '../../utils';
import { STILLING } from '../../fasitProperties';
import './SearchResultsItem.less';

export default class SearchResultItem extends React.Component {
    componentDidMount() {
        if (this.props.shouldFocus) {
            this.link.focus();
        }
    }

    render() {
        const { stilling, urlQuery } = this.props;

//TODO: fjern denne:
        if ( stilling.properties.applicationdue !== undefined &&
            stilling.properties.applicationdue.length === "11.11.2222".length &&
            stilling.properties.applicationdue.toLowerCase().trim() !== "snarest" &&
            (stilling.properties.applicationdue !== formatISOString(stilling.expires, 'D. MMMM YYYY'))
        ) {
            console.log(`${stilling.uuid}  - Frist: ${stilling.properties.applicationdue} Utløper: ${formatISOString(stilling.expires, 'D. MMMM YYYY')}`);
        }
        return (
            <Link
                innerRef={(link) => {
                    this.link = link;
                }}
                className="SearchResultItem"
                to={`${STILLING}${stilling.uuid}${urlQuery}`}
            >
                <Row className="SearchResultItem__row">
                    <Column xs="12" md="4">
                        {stilling.properties.employer && (
                            <Normaltekst className="SearchResultItem__employer">
                                {stilling.properties.employer}
                            </Normaltekst>
                        )}
                    </Column>
                    <Column xs="12" md="8">
                        {stilling.updated && (
                            <Undertekst className="SearchResultItem__updated">
                                Registrert: {formatISOString(stilling.updated, 'D. MMMM YYYY')}{' - '}
                                Frist: {stilling.properties.applicationdue ? stilling.properties.applicationdue : 'Ikke oppgitt'}
                            </Undertekst>
                        )}

                        <Undertittel tag="h3" className="SearchResultItem__title">{stilling.title}</Undertittel>

                        {stilling.properties.jobtitle && stilling.title !== stilling.properties.jobtitle && (
                            <Normaltekst
                                className="SearchResultItem__jobtitle"
                            >
                                {stilling.properties.jobtitle}
                            </Normaltekst>
                        )}

                        {stilling.properties.location && (
                            <Normaltekst className="SearchResultItem__location">
                                {stilling.properties.location}
                            </Normaltekst>
                        )}
                    </Column>
                </Row>
            </Link>
        );
    }
}

SearchResultItem.defaultProps = {
    shouldFocus: false,
    urlQuery: ''
};

SearchResultItem.propTypes = {
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
