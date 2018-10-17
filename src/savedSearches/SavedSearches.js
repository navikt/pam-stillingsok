import Chevron from 'nav-frontend-chevron';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Sidetittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Disclaimer from '../discalimer/Disclaimer';
import DelayedSpinner from '../search/loading/DelayedSpinner';
import SavedSearchAlertStripe from './alertstripe/SavedSearchAlertStripe';
import SavedSearchError from './error/SavedSearchError';
import SavedSearchList from './list/SavedSearchList';
import ConfirmRemoveModal from './ConfirmRemoveModal';
import SavedSearchForm from './form/SavedSearchForm';
import NoSavedSearches from './noresult/NoSavedSearches';
import './SavedSearches.less';
import { FETCH_SAVED_SEARCHES } from './savedSearchesReducer';

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
                <SavedSearchAlertStripe />
                <SavedSearchError />
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
                                    {!this.props.isFetching ? ` (${this.props.totalElements})` : ''}
                                </Sidetittel>
                            </Column>
                        </Row>
                    </Container>
                </div>
                <Container className="SavedSearches__main">
                    <Row>
                        <Column xs="12">
                            {this.props.isFetching ? (
                                <div className="SavedSearches__main__spinner">
                                    <DelayedSpinner />
                                </div>
                            ) : (
                                <div>
                                    {this.props.savedSearches.length === 0 ? (
                                        <NoSavedSearches />
                                    ) : (
                                        <SavedSearchList />
                                    )}
                                </div>
                            )}
                        </Column>
                    </Row>
                </Container>
                <SavedSearchForm />
                <ConfirmRemoveModal />
            </div>
        );
    }
}

SavedSearches.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    totalElements: PropTypes.number.isRequired,
    fetchSavedSearches: PropTypes.func.isRequired,
    savedSearches: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    savedSearches: state.savedSearches.savedSearches,
    totalElements: state.savedSearches.totalElements,
    isFetching: state.savedSearches.isFetching
});

const mapDispatchToProps = (dispatch) => ({
    fetchSavedSearches: () => dispatch({ type: FETCH_SAVED_SEARCHES })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearches);
