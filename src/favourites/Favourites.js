import Chevron from 'nav-frontend-chevron';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Sidetittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Disclaimer from '../discalimer/Disclaimer';
import DelayedSpinner from '../search/loading/DelayedSpinner';
import ConfirmRemoveModal from './ConfirmRemoveModal';
import Favourite from './Favourite';
import FavouriteAlertStripe from './FavouriteAlertStripe';
import FavouriteError from './FavouriteError';
import './Favourites.less';
import { FETCH_FAVOURITES } from './favouritesReducer';
import NoFavourites from './NoFavourites';

class Favourites extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = 'Favouriter';
        this.props.fetchFavourites();
    }

    render() {
        return (
            <div className="Favourites">
                <Disclaimer />
                <FavouriteAlertStripe />
                <FavouriteError />
                <div className="Favourites__backbutton">
                    <Container className="Favourites__backbutton__container">
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
                <div className="Favourites__header">
                    <Container className="Favourites__header__container">
                        <Row>
                            <Column xs="12">
                                <Sidetittel className="Search__header__title">
                                    Favoritter
                                    {!this.props.isFetchingFavourites ? ` (${this.props.totalElements})` : ''}
                                </Sidetittel>
                            </Column>
                        </Row>
                    </Container>
                </div>
                <Container className="Favourites__main">
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
                                        <div>
                                            {this.props.favourites.map((favourite) => (
                                                <Favourite key={favourite.uuid} favourite={favourite} />
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

Favourites.propTypes = {
    isFetchingFavourites: PropTypes.bool.isRequired,
    fetchFavourites: PropTypes.func.isRequired,
    totalElements: PropTypes.number.isRequired,
    favourites: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    favourites: state.favourites.favourites,
    totalElements: state.favourites.totalElements,
    isFetchingFavourites: state.favourites.isFetchingFavourites
});

const mapDispatchToProps = (dispatch) => ({
    fetchFavourites: () => dispatch({ type: FETCH_FAVOURITES })
});

export default connect(mapStateToProps, mapDispatchToProps)(Favourites);
