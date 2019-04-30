/* eslint-disable no-undef */
import { Column, Container, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import PageHeader from '../common/pageHeader/PageHeader';
import DelayedSpinner from '../search/loading/DelayedSpinner';
import NotAuthenticated from '../authentication/NotAuthenticated';
import NoUser from '../user/NoUser';
import SavedSearchAlertStripe from './alertstripe/SavedSearchAlertStripe';
import ConfirmRemoveModal from './ConfirmRemoveModal';
import SavedSearchForm from './form/SavedSearchForm';
import SavedSearchList from './list/SavedSearchList';
import NoSavedSearches from './noresult/NoSavedSearches';
import './SavedSearches.less';
import { authenticationEnum } from '../authentication/authenticationReducer';
import { CONTEXT_PATH } from '../fasitProperties';
import TotalSavedSearch from './totalSavedSearch/TotalSavedSearch';

class SavedSearches extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = 'Lagrede søk - Arbeidsplassen';
        window.analytics('set', 'page', `${CONTEXT_PATH}/lagrede-sok`);
        window.analytics('set', 'title', 'Lagrede søk');
        window.analytics('send', 'pageview');
    }

    render() {
        const {
            isAuthenticated,
            isFetching,
            isFetchingUser,
            savedSearches,
            totalElements,
            user
        } = this.props;
        return (
            <div className="SavedSearches">
                <SavedSearchAlertStripe />
                <PageHeader
                    backUrl={`${CONTEXT_PATH}`}
                    title="Lagrede søk"
                />
                <Container className="SavedSearches__main">
                    {isAuthenticated === authenticationEnum.NOT_AUTHENTICATED && (
                        <div className="SavedSearches__main">
                            <div className="SavedSearches__section">
                                <Row>
                                    <Column xs="12">
                                        <NotAuthenticated title="Du må logge inn for å se lagrede søk" />
                                    </Column>
                                </Row>
                            </div>
                        </div>
                    )}
                    {isAuthenticated === authenticationEnum.IS_AUTHENTICATED && (
                        <div>
                            {(isFetchingUser || isFetching) ? (
                                <Row>
                                    <Column xs="12">
                                        <div className="SavedSearches__main__spinner">
                                            <DelayedSpinner />
                                        </div>
                                    </Column>
                                </Row>
                            ) : (
                                <div>
                                    {!user && (
                                        <div className="SavedSearches__main">
                                            <div className="SavedSearches__section">
                                                <Row>
                                                    <Column xs="12">
                                                        <NoUser />
                                                    </Column>
                                                </Row>
                                            </div>
                                        </div>
                                    )}
                                    {user && (
                                        <Row>
                                            <Column xs="12">
                                                {isFetching ? (
                                                    <div className="SavedSearches__main__spinner">
                                                        <DelayedSpinner />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {savedSearches.length === 0 ? (
                                                            <NoSavedSearches />
                                                        ) : (
                                                            <div>
                                                                <TotalSavedSearch total={this.props.savedSearches.length} />
                                                                <SavedSearchList />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Column>
                                        </Row>
                                    )}
                                </div>
                            )}

                        </div>
                    )}
                </Container>
                <SavedSearchForm />
                <ConfirmRemoveModal />
            </div>
        );
    }
}


SavedSearches.defaultProps = {
    user: undefined
};

SavedSearches.propTypes = {
    user: PropTypes.shape(),
    isFetchingUser: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    totalElements: PropTypes.number.isRequired,
    savedSearches: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    user: state.user.user,
    isFetchingUser: state.user.isFetchingUser,
    isAuthenticated: state.authentication.isAuthenticated,
    savedSearches: state.savedSearches.savedSearches,
    totalElements: state.savedSearches.totalElements,
    isFetching: state.savedSearches.isFetching
});

export default connect(mapStateToProps)(SavedSearches);
