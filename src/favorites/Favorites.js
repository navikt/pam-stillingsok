import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Column } from 'nav-frontend-grid';
import { Sidetittel } from 'nav-frontend-typografi';
import Chevron from 'nav-frontend-chevron';
import { FETCH_FAVORITE_ADS, FETCH_FAVORITES } from './favoritesReducer';
import Disclaimer from '../discalimer/Disclaimer';
import Favorite from './Favorite';
import './Favorites.less';
import ConfirmRemoveModal from './ConfirmRemoveModal';

class Favorites extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = 'Favoriter';
        this.props.fetchFavoriteAds();
        this.props.fetchFavorites();
    }

    render() {
        return (
            <div className="Favorites">
                <Disclaimer />
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
                                    Favoritter ({this.props.favorites.length})
                                </Sidetittel>
                            </Column>
                        </Row>
                    </Container>
                </div>
                <Container className="Favorites__main">
                    <Row>
                        <Column xs="12">
                            {this.props.favoriteAds.length === 0 ? (
                                <div>
                                    Ingen favoritter
                                </div>
                            ) : (
                                <div>
                                    {this.props.favoriteAds.map((favoriteAd) => (
                                        <Favorite key={favoriteAd.uuid} favorite={favoriteAd} />
                                    ))}
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
    fetchFavorites: PropTypes.func.isRequired,
    fetchFavoriteAds: PropTypes.func.isRequired,
    favoriteAds: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired,
    favorites: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    favoriteAds: state.favorites.favoriteAds,
    favorites: state.favorites.favorites
});

const mapDispatchToProps = (dispatch) => ({
    fetchFavoriteAds: () => dispatch({ type: FETCH_FAVORITE_ADS }),
    fetchFavorites: () => dispatch({ type: FETCH_FAVORITES })
});

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
