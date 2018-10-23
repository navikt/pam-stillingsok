import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withoutPending } from '../savedSearchesReducer';
import SavedSearchListItem from './SavedSearchListItem';
import './SavedSearchList.less';

function SavedSearchList({ savedSearches }) {
    return (
        <div>
            {savedSearches.map((savedSearch) => (
                <SavedSearchListItem key={savedSearch.uuid} savedSearch={savedSearch} />
            ))}
        </div>
    );
}

SavedSearchList.propTypes = {
    savedSearches: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    savedSearches: withoutPending(state.savedSearches)
});

export default connect(mapStateToProps)(SavedSearchList);
