import React from 'react';
import PropTypes from 'prop-types';
import FavouriteButton from '../../favourites/FavouriteButton';
import SearchResultsItemDetails from './SearchResultsItemDetails';
import './SearchResultsItem.less';

export default class SearchResultItem extends React.Component {
    render() {
        const { stilling } = this.props;
        return (
            <div className="SearchResultItem">
                <FavouriteButton uuid={stilling.uuid} className="SearchResultItem__favourite" />
                <SearchResultsItemDetails stilling={stilling} />
            </div>
        );
    }
}

SearchResultItem.propTypes = {
    stilling: PropTypes.shape({}).isRequired
};
