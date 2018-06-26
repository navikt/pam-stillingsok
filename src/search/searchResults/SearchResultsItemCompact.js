import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Column } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { formatISOString } from '../../utils';
import { STILLING } from '../../fasitProperties';
import './SearchResultsItemCompact.less';

export default class SearchResultsItemCompact extends React.Component {
    componentDidMount() {
        if (this.props.shouldFocus) {
            this.link.focus();
        }
    }

    render() {
        const { stilling, urlQuery } = this.props;
        return (
            <Link
                innerRef={(link) => {
                    this.link = link;
                }}
                className="SearchResultItemCompact"
                to={`${STILLING}${stilling.uuid}${urlQuery}`}
            >
                <Row>
                    <Column xs="12" md="4">
                        {stilling.properties.employer && (
                            <Normaltekst className="SearchResultItemCompact__employer">
                                {stilling.properties.employer} - {stilling.properties.location}
                            </Normaltekst>
                        )}

                    </Column>
                    <Column xs="9" md="7">
                        {stilling.properties.jobtitle && stilling.title !== stilling.properties.jobtitle ? (
                            <Normaltekst
                                tag="h3"
                                className="SearchResultItemCompact__title"
                            >
                                <b>{stilling.properties.jobtitle}</b> - {stilling.title}
                            </Normaltekst>
                        ) : (
                            <Element tag="h3" className="SearchResultItemCompact__title">{stilling.title}</Element>
                        )}
                    </Column>
                    <Column xs="2" md="1">
                        {stilling.updated && (
                            <Undertekst className="SearchResultItem__updated">
                                {formatISOString(stilling.updated, 'DD.MMM')}
                            </Undertekst>
                        )}
                    </Column>
                </Row>
            </Link>
        );
    }
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
