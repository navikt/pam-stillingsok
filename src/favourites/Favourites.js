/* eslint-disable no-undef,no-nested-ternary */
import { Column, Container, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import PageHeader from '../common/pageHeader/PageHeader';
import DelayedSpinner from '../common/DelayedSpinner';
import NotAuthenticated from '../authentication/NotAuthenticated';
import RestoreScroll from '../search/RestoreScroll';
import NoUser from '../user/NoUser';
import FavouriteAlertStripe from './alertstripe/FavouriteAlertStripe';
import './Favourites.less';
import FavouriteList from './list/FavouriteList';
import RemoveFavouriteModal from './modal/RemoveFavouriteModal';
import NoFavourites from './noresult/NoFavourites';
import { authenticationEnum } from '../authentication/authenticationReducer';
import { CONTEXT_PATH } from '../fasitProperties';
import TotalFavourites from './totalFavourites/TotalFavourutes';
import { useDocumentTitle, useGoogleAnalytics, useScrollToTop } from '../common/hooks';

const Favourites = ({
                        favourites,
                        isAuthenticated,
                        isFetchingFavourites,
                        isFetchingUser,
                        user
                    }) => {
    useDocumentTitle('Favoritter - Arbeidsplassen');
    useGoogleAnalytics(`${CONTEXT_PATH}/favoritter`, 'Favoritter');
    useScrollToTop();

    return (
        <RestoreScroll id="Favourites">
        <RestoreScroll id="Favourites">
            <div className="Favourites">
                <FavouriteAlertStripe/>
                <PageHeader
                    title="Favoritter"
                />
                <Container className="Favourites__main">
                    {isAuthenticated === authenticationEnum.NOT_AUTHENTICATED && (
                        <Row>
                            <Column xs="12">
                                <NotAuthenticated title="Du må logge inn for å se dine favoritter"/>
                            </Column>
                        </Row>
                    )}
                    {isAuthenticated === authenticationEnum.IS_AUTHENTICATED && (
                        (isFetchingUser || isFetchingFavourites) ? (
                            <Row>
                                <Column xs="12">
                                    <div className="Favourites__main__spinner">
                                        <DelayedSpinner/>
                                    </div>
                                </Column>
                            </Row>
                        ) : (
                            user ? (
                                <Row>
                                    <Column xs="12">
                                        {favourites.length === 0 ? (
                                            <NoFavourites/>
                                        ) : (
                                            <React.Fragment>
                                                <TotalFavourites total={favourites.length}/>
                                                <FavouriteList/>
                                            </React.Fragment>
                                        )}
                                    </Column>
                                </Row>
                            ) : (
                                <Row>
                                    <Column xs="12">
                                        <NoUser/>
                                    </Column>
                                </Row>
                            )
                        )
                    )}
                </Container>
                <RemoveFavouriteModal/>
            </div>
        </RestoreScroll>
    );
};

Favourites.defaultProps = {
    user: undefined
};

Favourites.propTypes = {
    user: PropTypes.shape(),
    isFetchingUser: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.string.isRequired,
    isFetchingFavourites: PropTypes.bool.isRequired,
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
    isFetchingFavourites: state.favourites.isFetchingFavourites
});

export default connect(mapStateToProps)(Favourites);
