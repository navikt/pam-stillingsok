import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Flatknapp } from 'nav-frontend-knapper';
import { SHOW_MODAL_REMOVE_FROM_FAVORITES } from './favoritesReducer';
import SearchResultsItemDetails from '../search/searchResults/SearchResultsItemDetails';

class Favorite extends React.Component {
    onRemoveClick = () => {
        this.props.showModal(this.props.favorite.uuid);
    };

    render() {
        const { favorite } = this.props;
        return (
            <div className="Favorite">
                <SearchResultsItemDetails stilling={favorite} />
                <div className="Favorite__buttons">
                    <Flatknapp mini onClick={this.onRemoveClick}>Slett</Flatknapp>
                </div>
            </div>
        );
    }
}

Favorite.propTypes = {
    showModal: PropTypes.func.isRequired,
    favorite: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    }).isRequired
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    showModal: (uuid) => dispatch({ type: SHOW_MODAL_REMOVE_FROM_FAVORITES, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(Favorite);
