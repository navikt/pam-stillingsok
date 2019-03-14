/* eslint-disable no-undef */
import { Column, Container, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import PageHeader from '../common/pageHeader/PageHeader';
import DelayedSpinner from '../search/loading/DelayedSpinner';
import NotAuthenticated from '../authentication/NotAuthenticated';
import NoUser from '../user/NoUser';
import FavouriteAlertStripe from './alertstripe/FavouriteAlertStripe';
import './Favourites.less';
import FavouriteList from './list/FavouriteList';
import RemoveFavouriteModal from './modal/RemoveFavouriteModal';
import NoFavourites from './noresult/NoFavourites';
import { authenticationEnum } from '../authentication/authenticationReducer';
import { CONTEXT_PATH } from '../fasitProperties';

class Favourites extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = 'Favoritter - Arbeidsplassen';
        ga('set', 'page', `${CONTEXT_PATH}/favoritter`);
        ga('set', 'title', 'Favoritter');
        ga('send', 'pageview');
    }

    render() {
        const {
            favourites,
            isAuthenticated,
            isFetchingFavourites,
            isFetchingUser,
            totalElements,
            user
        } = this.props;
        return (
            <div className="Favourites">
                <FavouriteAlertStripe />
                <PageHeader
                    backUrl={`${CONTEXT_PATH}/`}
                    title={`Favoritter ${!isFetchingFavourites && totalElements > 0 ? `(${totalElements})` : ''}`}
                />
                <Container className="Favourites__main">
                    {isAuthenticated === authenticationEnum.NOT_AUTHENTICATED && (
                        <div className="Favourites__main">
                            <div className="Favourites__section">
                                <Row>
                                    <Column xs="12">
                                        <NotAuthenticated title="Du må logge inn for å se dine favoritter" />
                                    </Column>
                                </Row>
                            </div>
                        </div>
                    )}
                    {isAuthenticated === authenticationEnum.IS_AUTHENTICATED && (
                        <div>
                            {(isFetchingUser || isFetchingFavourites) ? (
                                <Row>
                                    <Column xs="12">
                                        <div className="Favourites__main__spinner">
                                            <DelayedSpinner />
                                        </div>
                                    </Column>
                                </Row>
                            ) : (
                                <div>
                                    {!user && (
                                        <div className="Favourites__main">
                                            <div className="Favourites__section">
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
                                                <div>
                                                    {favourites.length === 0 ? (
                                                        <NoFavourites />
                                                    ) : (
                                                        <FavouriteList />
                                                    )}
                                                </div>
                                            </Column>
                                        </Row>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </Container>
                <RemoveFavouriteModal />
            </div>
        );
    }
}
Favourites.defaultProps = {
    user: undefined
};

Favourites.propTypes = {
    user: PropTypes.shape(),
    isFetchingUser: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.string.isRequired,
    isFetchingFavourites: PropTypes.bool.isRequired,
    totalElements: PropTypes.number.isRequired,
    favourites: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    user: state.user.user,
    isFetchingUser: state.user.isFetchingUser,
    isAuthenticated: state.authentication.isAuthenticated,
    favourites: state.favourites.favourites,
    totalElements: state.favourites.totalElements,
    isFetchingFavourites: state.favourites.isFetchingFavourites
});

export default connect(mapStateToProps)(Favourites);
