import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Column } from 'nav-frontend-grid';
import { Sidetittel } from 'nav-frontend-typografi';
import Chevron from 'nav-frontend-chevron';
import DelayedSpinner from '../search/loading/DelayedSpinner';
import FavoriteAlertStripe from './FavoriteAlertStripe';
import FavoriteError from './FavoriteError';
import { FETCH_FAVORITES } from './favoritesReducer';
import Disclaimer from '../discalimer/Disclaimer';
import Favorite from './Favorite';
import './Favorites.less';
import ConfirmRemoveModal from './ConfirmRemoveModal';
import NoFavorites from './NoFavorites';

class Favorites extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = 'Favoriter';
        this.props.fetchFavorites();
    }

    render() {
        return (
            <div className="Favorites">
                <Disclaimer />
                <FavoriteAlertStripe />
                <FavoriteError />
                <div className="Favorites__backbutton">
                    <Container className="Favorites__backbutton__container">
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
                <div className="Favorites__header">
                    <Container className="Favorites__header__container">
                        <Row>
                            <Column xs="12">
                                <Sidetittel className="Search__header__title">
                                    Favoritter
                                    {!this.props.isFetchingFavorites ? ` (${this.props.favorites.length})` : ''}
                                </Sidetittel>
                            </Column>
                        </Row>
                    </Container>
                </div>
                <Container className="Favorites__main">
                    <Row>
                        <Column xs="12">
                            {this.props.isFetchingFavorites ? (
                                <div className="Favorites__main__spinner">
                                    <DelayedSpinner />
                                </div>
                            ) : (
                                <div>
                                    {this.props.favorites.length === 0 ? (
                                        <NoFavorites />
                                    ) : (
                                        <div>
                                            {this.props.favorites.map((favorite) => (
                                                <Favorite key={favorite.uuid} favorite={favorite} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Column>
                    </Row>
                </Container>
                <ConfirmRemoveModal />
            </div>
        );
    }
}

Favorites.propTypes = {
    isFetchingFavorites: PropTypes.bool.isRequired,
    fetchFavorites: PropTypes.func.isRequired,
    favorites: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    favorites: state.favorites.favorites,
    isFetchingFavorites: state.favorites.isFetchingFavorites
});

const mapDispatchToProps = (dispatch) => ({
    fetchFavorites: () => dispatch({ type: FETCH_FAVORITES })
});

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
