import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchResultItem from './SearchResultsItem';

class SearchResults extends React.Component {
    static componentDidMount() {
        try {
            let lastScrollPosition = sessionStorage.getItem('lastScrollPosition');
            if (lastScrollPosition !== null) {
                lastScrollPosition = parseInt(lastScrollPosition, 10);
                sessionStorage.removeItem('lastScrollPosition');
                window.scrollTo(0, lastScrollPosition);
            }
        } catch (e) {
            // Do nothing
        }
    }

    render() {
        const { stillinger } = this.props.searchResult;
        return (
            <div>
                {stillinger && stillinger.map((stilling) => (
                    <SearchResultItem key={stilling.uuid} stilling={stilling} />
                ))}
            </div>
        );
    }
}

SearchResults.propTypes = {
    searchResult: PropTypes.shape({
        stillinger: PropTypes.arrayOf(PropTypes.object)
    }).isRequired
};

const mapStateToProps = (state) => ({
    searchResult: state.search.searchResult
});

export default connect(mapStateToProps)(SearchResults);
