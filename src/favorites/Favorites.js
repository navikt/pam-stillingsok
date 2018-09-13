import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Column } from 'nav-frontend-grid';
import { Sidetittel } from 'nav-frontend-typografi';
import Chevron from 'nav-frontend-chevron';
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
                            {this.props.favorites.length === 0 ? (
                                <NoFavorites />
                            ) : (
                                <div>
                                    {this.props.favorites.map((favorite) => (
                                        <Favorite key={favorite.uuid} favorite={favorite} />
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
    favorites: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    favorites: state.favorites.favorites
});

const mapDispatchToProps = (dispatch) => ({
    fetchFavorites: () => dispatch({ type: FETCH_FAVORITES })
});

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
