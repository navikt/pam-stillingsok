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

class SavedSearches extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = 'Lagrede søk';
    }

    render() {
        return (
            <div className="SavedSearches">
                <SavedSearchAlertStripe />
                <PageHeader
                    backUrl="/"
                    title={`Lagrede søk ${!this.props.isFetching && this.props.totalElements > 0 ? `(${this.props.totalElements})` : ''}`}
                />
                <Container className="SavedSearches__main">
                    {this.props.isAuthenticated === authenticationEnum.NOT_AUTHENTICATED && (
                        <div className="UserSettings__main">
                            <div className="UserSettings__section">
                                <Row>
                                    <Column xs="12">
                                        <NotAuthenticated title="Du må logge inn for å se lagrede søk" />
                                    </Column>
                                </Row>
                            </div>
                        </div>
                    )}
                    {this.props.isAuthenticated === authenticationEnum.IS_AUTHENTICATED && (
                        <div>
                            {!this.props.user && (
                                <div className="UserSettings__main">
                                    <div className="UserSettings__section">
                                        <Row>
                                            <Column xs="12">
                                                <NoUser />
                                            </Column>
                                        </Row>
                                    </div>
                                </div>
                            )}

                            {this.props.user && (
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
    isAuthenticated: state.authentication.isAuthenticated,
    savedSearches: state.savedSearches.savedSearches,
    totalElements: state.savedSearches.totalElements,
    isFetching: state.savedSearches.isFetching
});

export default connect(mapStateToProps)(SavedSearches);
