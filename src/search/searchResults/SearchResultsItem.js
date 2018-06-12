import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Column } from 'nav-frontend-grid';
import { Ingress, Normaltekst, Element } from 'nav-frontend-typografi';
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
        const { stilling } = this.props;
        return (
            <Link
                innerRef={(link) => {
                    this.link = link;
                }}
                className="SearchResultItem"
                to={`${STILLING}${stilling.uuid}`}
            >
                <Row>
                    <Column xs="12">
                        {stilling.updated && (
                            <Normaltekst className="SearchResultItem__updated">
                                {formatISOString(stilling.updated, 'D. MMMM YYYY')}
                            </Normaltekst>
                        )}

                        <Ingress tag="h3" className="SearchResultItem__title">{stilling.title}</Ingress>

                        {stilling.properties.jobtitle && stilling.title !== stilling.properties.jobtitle && (
                            <Element className="SearchResultItem__jobtitle">{stilling.properties.jobtitle}</Element>
                        )}

                        {stilling.properties.employer && (
                            <Normaltekst className="SearchResultItem__employer">
                                {stilling.properties.employer}
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
    shouldFocus: false
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
    shouldFocus: PropTypes.bool
};
