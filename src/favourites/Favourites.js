import { Column, Container, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import PageHeader from '../common/pageHeader/PageHeader';
import Disclaimer from '../discalimer/Disclaimer';
import DelayedSpinner from '../search/loading/DelayedSpinner';
import FavouriteAlertStripe from './alertstripe/FavouriteAlertStripe';
import FavouriteError from './error/FavouriteError';
import './Favourites.less';
import FavouriteList from './list/FavouriteList';
import RemoveFavouriteModal from './modal/RemoveFavouriteModal';
import NoFavourites from './noresult/NoFavourites';

class Favourites extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = 'Favoritter';
    }

    render() {
        return (
            <div className="Favourites">
                <Disclaimer />
                <FavouriteAlertStripe />
                <FavouriteError />
                <PageHeader
                    backUrl="/"
                    title={`Favoritter ${!this.props.isFetchingFavourites ? `(${this.props.totalElements})` : ''}`}
                />
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
                                        <FavouriteList />
                                    )}
                                </div>
                            )}
                        </Column>
                    </Row>
                </Container>
                <RemoveFavouriteModal />
            </div>
        );
    }
}

Favourites.propTypes = {
    isFetchingFavourites: PropTypes.bool.isRequired,
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

export default connect(mapStateToProps)(Favourites);
