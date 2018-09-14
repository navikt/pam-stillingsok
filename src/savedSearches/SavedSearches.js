import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Column } from 'nav-frontend-grid';
import { Sidetittel } from 'nav-frontend-typografi';
import Chevron from 'nav-frontend-chevron';
import DelayedSpinner from '../search/loading/DelayedSpinner';
import Disclaimer from '../discalimer/Disclaimer';
import ConfirmRemoveModal from './ConfirmRemoveModal';
import EditSavedSearchModal from './EditSavedSearchModal';
import NoSavedSearches from './NoSavedSearches';
import SavedSearch from './SavedSearch';
import SavedSearchesAlertStripe from './SavedSearchesAlertStripe';
import { FETCH_SAVED_SEARCHES } from './savedSearchesReducer';
import './SavedSearches.less';

class SavedSearches extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = 'Lagrede søk';
        this.props.fetchSavedSearches();
    }

    render() {
        return (
            <div className="SavedSearches">
                <Disclaimer />
                <SavedSearchesAlertStripe />
                <div className="SavedSearches__backbutton">
                    <Container className="SavedSearches__backbutton__container">
                        <Link
                            to="/"
                            className="BackToSearchLink knapp knapp--flat no-print"
                        >
                            <Chevron type="venstre" className="BackToSearchLink__chevron" />
                            <span className="BackToSearchLink__text">
                                Til stillingsøk
                            </span>
                        </Link>
                    </Container>
                </div>
                <div className="SavedSearches__header">
                    <Container className="SavedSearches__header__container">
                        <Row>
                            <Column xs="12">
                                <Sidetittel className="Search__header__title">
                                    Lagrede søk
                                    {!this.props.isFetchingSavedSearches ? ` (${this.props.savedSearches.length})` : ''}
                                </Sidetittel>
                            </Column>
                        </Row>
                    </Container>
                </div>
                <Container className="SavedSearches__main">
                    <Row>
                        <Column xs="12">
                            {this.props.isFetchingSavedSearches ? (
                                <div className="SavedSearches__main__spinner">
                                    <DelayedSpinner />
                                </div>
                            ) : (
                                <div>
                                    {this.props.savedSearches.length === 0 ? (
                                        <NoSavedSearches />
                                    ) : (
                                        <div>
                                            {this.props.savedSearches.map((savedSearch) => (
                                                <SavedSearch key={savedSearch.uuid} savedSearch={savedSearch} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Column>
                    </Row>
                </Container>
                <EditSavedSearchModal />
                <ConfirmRemoveModal />
            </div>
        );
    }
}

SavedSearches.propTypes = {
    isFetchingSavedSearches: PropTypes.bool.isRequired,
    fetchSavedSearches: PropTypes.func.isRequired,
    savedSearches: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    savedSearches: state.savedSearches.savedSearches,
    isFetchingSavedSearches: state.savedSearches.isFetchingSavedSearches
});

const mapDispatchToProps = (dispatch) => ({
    fetchSavedSearches: () => dispatch({ type: FETCH_SAVED_SEARCHES })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearches);
