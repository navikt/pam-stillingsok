import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { INITIAL_SEARCH } from '../search/searchReducer';
import { COLLAPSE_SAVED_SEARCHES } from './savedSearchesReducer';

class SavedSearchesExpandItem extends React.Component {
    onTitleClick = (e) => {
        e.preventDefault();
        try {
            sessionStorage.setItem('url', this.props.savedSearch.url);
            this.props.collapseSavedSearches();
            this.props.search();
        } catch (error) {
            // Ignore session storage error
        }
    };

    render() {
        const { savedSearch } = this.props;
        return (
            <div className="SavedSearchesExpandItem">
                <a href="#" className="lenke typo-normal" onClick={this.onTitleClick}>
                    {savedSearch.title}
                </a>
            </div>
        );
    }
}

SavedSearchesExpandItem.propTypes = {
    collapseSavedSearches: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    savedSearch: PropTypes.shape({
        url: PropTypes.string,
        title: PropTypes.string
    }).isRequired
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: INITIAL_SEARCH }),
    collapseSavedSearches: () => dispatch({ type: COLLAPSE_SAVED_SEARCHES })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearchesExpandItem);
