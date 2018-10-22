import Chevron from 'nav-frontend-chevron';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Sidetittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PageHeader from '../common/pageHeader/PageHeader';
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
                <PageHeader
                    backUrl="/"
                    title={`Lagrede søk ${!this.props.isFetching ? `(${this.props.totalElements})` : ''}`}
                />
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
