/* eslint-disable no-undef,no-nested-ternary */
import { Column, Container, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import PageHeader from '../common/components/PageHeader';
import DelayedSpinner from '../common/components/DelayedSpinner';
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
import { useDocumentTitle, useTrackPageview, useScrollToTop } from '../common/hooks';
import UnderFifteenInfo from "../underFifteenInfo/UnderFifteenInfo";

const SavedSearches = ({
    isAuthenticated,
    isFetching,
    isFetchingUser,
    savedSearches,
    user,
    erUnderFemten,
}) => {
    useDocumentTitle('Lagrede søk - Arbeidsplassen');
    useTrackPageview(`${CONTEXT_PATH}/lagrede-sok`, 'Lagrede søk');
    useScrollToTop();

    if (erUnderFemten) {
        return <UnderFifteenInfo knapperad={true} />
    }

    return (
        <div className="SavedSearches">
            <SavedSearchAlertStripe />
            <PageHeader
                title="Lagrede søk"
            />
            <Container className="SavedSearches__main">

                {isAuthenticated === authenticationEnum.NOT_AUTHENTICATED && (
                    <Row>
                        <Column xs="12">
                            <NotAuthenticated title="Du må logge inn for å se lagrede søk" />
                        </Column>
                    </Row>
                )}
                {isAuthenticated === authenticationEnum.IS_AUTHENTICATED && (
                    (isFetchingUser || isFetching) ? (
                        <Row>
                            <Column xs="12">
                                <div className="SavedSearches__main__spinner">
                                    <DelayedSpinner />
                                </div>
                            </Column>
                        </Row>
                    ) : (
                        <React.Fragment>
                            {!user && (
                                <Row>
                                    <Column xs="12">
                                        <NoUser />
                                    </Column>
                                </Row>
                            )}
                            {user && (
                                <Row>
                                    <Column xs="12">
                                        {isFetching ? (
                                            <div className="SavedSearches__main__spinner">
                                                <DelayedSpinner />
                                            </div>
                                        ) : (
                                            savedSearches.length === 0 ? (
                                                <NoSavedSearches />
                                            ) : (
                                                <React.Fragment>
                                                    <TotalSavedSearch total={savedSearches.length} />
                                                    <SavedSearchList />
                                                </React.Fragment>
                                            )
                                        )}
                                    </Column>
                                </Row>
                            )}
                        </React.Fragment>
                    )
                )}
            </Container>
            <SavedSearchForm />
            <ConfirmRemoveModal />
        </div>
    )
};

SavedSearches.defaultProps = {
    user: undefined
};

SavedSearches.propTypes = {
    user: PropTypes.shape(),
    isFetchingUser: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
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
    isFetching: state.savedSearches.isFetching,
    erUnderFemten: state.user.erUnderFemten
});

export default connect(mapStateToProps)(SavedSearches);
