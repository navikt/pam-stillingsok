/* eslint-disable no-undef,no-nested-ternary */
import { Column, Container, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PageHeader from '../common/components/PageHeader';
import DelayedSpinner from '../common/components/DelayedSpinner';
import NotAuthenticated from '../authentication/NotAuthenticated';
import RestoreScroll from '../common/components/RestoreScroll';
import NoUser from '../user/NoUser';
import FavouriteAlertStripe from './alertstripe/FavouriteAlertStripe';
import './Favourites.less';
import { FETCH_FAVOURITES, SET_FAVOURITES_SORTING } from './favouritesReducer';
import FavouriteList from './list/FavouriteList';
import RemoveFavouriteModal from './modal/RemoveFavouriteModal';
import NoFavourites from './noresult/NoFavourites';
import { authenticationEnum } from '../authentication/authenticationReducer';
import { CONTEXT_PATH } from '../fasitProperties';
import Sorting from './sorting/Sorting';
import TotalFavourites from './totalFavourites/TotalFavourutes';
import { useDocumentTitle, useTrackPageview, useScrollToTop } from '../common/hooks';
import UnderFifteenInfo from "../underFifteenInfo/UnderFifteenInfo";

const Favourites = (
    {
        favourites,
        isAuthenticated,
        isFetchingFavourites,
        isFetchingUser,
        user,
        fetchFavourites,
        erUnderFemten
    }
) => {
    useDocumentTitle('Favoritter - Arbeidsplassen');
    useTrackPageview(`${CONTEXT_PATH}/favoritter`, 'Favoritter');
    useScrollToTop();

    useEffect(() => {
        fetchFavourites();
    }, []);

    if (erUnderFemten) {
       return <UnderFifteenInfo />
    }

    return (
        <RestoreScroll id="Favourites">
            <a id="main-content" tabIndex="-1" />
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
                                                <div className="Favourites__main__total-and-sorting">
                                                    <TotalFavourites total={favourites.length}/>
                                                    <Sorting />
                                                </div>
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
    })).isRequired,
    fetchFavourites: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user.user,
    isFetchingUser: state.user.isFetchingUser,
    isAuthenticated: state.authentication.isAuthenticated,
    favourites: state.favourites.favourites,
    isFetchingFavourites: state.favourites.isFetchingFavourites,
    erUnderFemten: state.user.erUnderFemten
});

const mapDispatchToProps = (dispatch) => ({
    fetchFavourites: () => dispatch({ type: FETCH_FAVOURITES })
});

export default connect(mapStateToProps, mapDispatchToProps)(Favourites);
