import React from 'react';
import PropTypes from 'prop-types';
import FavoriteButton from '../../favorites/FavoriteButton';
import SearchResultsItemDetails from './SearchResultsItemDetails';
import './SearchResultsItem.less';

export default class SearchResultItem extends React.Component {
    render() {
        const { stilling } = this.props;
        return (
            <div className="SearchResultItem">
                <FavoriteButton uuid={stilling.uuid} className="SearchResultItem__favorite" />
                <SearchResultsItemDetails stilling={stilling} />
            </div>
        );
    }
}

SearchResultItem.propTypes = {
    stilling: PropTypes.shape({}).isRequired
};
