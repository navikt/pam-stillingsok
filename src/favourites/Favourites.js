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
import {CONTEXT_PATH} from "../fasitProperties";

class Favourites extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = 'Favoritter - Arbeidsplassen';
    }

    render() {
        return (
            <div className="Favourites">
                <FavouriteAlertStripe />
                <PageHeader
                    backUrl={`${CONTEXT_PATH}/`}
                    title={`Favoritter ${!this.props.isFetchingFavourites && this.props.totalElements > 0 ? `(${this.props.totalElements})` : ''}`}
                />
                <Container className="Favourites__main">
                    {this.props.isAuthenticated === authenticationEnum.NOT_AUTHENTICATED && (
                        <div className="UserSettings__main">
                            <div className="UserSettings__section">
                                <Row>
                                    <Column xs="12">
                                        <NotAuthenticated title="Du må logge inn for å se dine favoritter" />
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
                                        {this.props.isFetchingFavourites ? (
                                            <div className="Favourites__main__spinner">
                                                <DelayedSpinner />
                                            </div>
                                        ) : (
                                            <div>
                                                {this.props.favourites.length === 0 ? (
                                                    <NoFavourites />
                                                ) : (
                                                    <FavouriteList />
                                                )}
                                            </div>
                                        )}
                                    </Column>
                                </Row>
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
    isAuthenticated: state.authentication.isAuthenticated,
    favourites: state.favourites.favourites,
    totalElements: state.favourites.totalElements,
    isFetchingFavourites: state.favourites.isFetchingFavourites
});

export default connect(mapStateToProps)(Favourites);
