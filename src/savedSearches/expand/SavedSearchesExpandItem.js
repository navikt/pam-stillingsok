import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { INITIAL_SEARCH } from '../../search/searchReducer';
import { SET_CURRENT_SAVED_SEARCH } from '../savedSearchesReducer';
import { COLLAPSE_SAVED_SEARCHES } from './savedSearchExpandReducer';

class SavedSearchesExpandItem extends React.Component {
    onTitleClick = (e) => {
        e.preventDefault();
        try {
            this.props.setCurrentSavedSearch(this.props.savedSearch);
            this.props.collapseSavedSearches();
            document.body.classList.remove('screen-xs-no-scroll');
            this.props.search();
        } catch (error) {
            // Ignore session storage error
        }
    };

    render() {
        const { savedSearch } = this.props;
        return (
            <li className="SavedSearchesExpandItem">
                <a href="#" className="link" onClick={this.onTitleClick}>
                    {savedSearch.title}
                </a>
            </li>
        );
    }
}

SavedSearchesExpandItem.propTypes = {
    setCurrentSavedSearch: PropTypes.func.isRequired,
    collapseSavedSearches: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    savedSearch: PropTypes.shape({
        url: PropTypes.string,
        title: PropTypes.string,
        searchQuery: PropTypes.string
    }).isRequired
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: INITIAL_SEARCH }),
    collapseSavedSearches: () => dispatch({ type: COLLAPSE_SAVED_SEARCHES }),
    setCurrentSavedSearch: (savedSearch) => dispatch({ type: SET_CURRENT_SAVED_SEARCH, savedSearch })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearchesExpandItem);
