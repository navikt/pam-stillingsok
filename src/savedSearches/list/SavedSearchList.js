import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {
    withoutPending
} from '../savedSearchesReducer';
import SavedSearchListItem from './SavedSearchListItem';
import './SavedSearchList.less';
import {SavedSearchFormMode, SHOW_SAVED_SEARCH_FORM} from "../form/savedSearchFormReducer";


class SavedSearchList extends React.Component {

    componentDidMount() {
        const {savedSearches} = this.props;
        let uuid = null;

        location.search.split('&').forEach(q => {
            const split = q.split('=');

            if (split.length === 2 && split[0].includes('uuid')) {
                uuid = split[1];
            }
        });

        if (typeof uuid === 'string') {
            const savedSearch = savedSearches.filter(s => s.uuid === uuid)[0];

            if (savedSearch !== undefined) {
                this.props.showSavedSearchForm(savedSearch);
            }
        }
    }

    render() {
        const {savedSearches} = this.props;

        return (
            <div>
                {savedSearches.map((savedSearch) => (
                    <SavedSearchListItem key={savedSearch.uuid} savedSearch={savedSearch}/>
                ))}
            </div>
        );
    }
}

SavedSearchList.propTypes = {
    savedSearches: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string
    })).isRequired,
    showSavedSearchForm: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    savedSearches: withoutPending(state.savedSearches),
});

const mapDispatchToProps = (dispatch) => ({
    showSavedSearchForm: (formData) => dispatch({
        type: SHOW_SAVED_SEARCH_FORM,
        formMode: SavedSearchFormMode.EDIT,
        formData,
        showAddOrReplace: false
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearchList);
