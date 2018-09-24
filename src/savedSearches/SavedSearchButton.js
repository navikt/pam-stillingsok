import Chevron from 'nav-frontend-chevron';
import { Knapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { COLLAPSE_SAVED_SEARCHES, EXPAND_SAVED_SEARCHES } from './expand/savedSearchExpandReducer';

class SavedSearchButton extends React.Component {
    onClick = () => {
        if (this.props.isSavedSearchesExpanded) {
            this.props.collapseSavedSearches();
        } else {
            this.props.expandSavedSearches();
        }
    };

    render() {
        return (
            <Knapp mini to="/lagrede-sok" onClick={this.onClick}>
                Lagrede søk {!this.props.isFetching ? ` (${this.props.savedSearches.length})` : ''}
                <Chevron
                    className="SavedSearchExpandButton__chevron"
                    type={this.props.isSavedSearchesExpanded ? 'opp' : 'ned'}
                />
            </Knapp>
        );
    }
}

SavedSearchButton.propTypes = {
    savedSearches: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFetching: PropTypes.bool.isRequired,
    isSavedSearchesExpanded: PropTypes.bool.isRequired,
    expandSavedSearches: PropTypes.func.isRequired,
    collapseSavedSearches: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    savedSearches: state.savedSearches.savedSearches,
    isFetching: state.savedSearches.isFetching,
    isSavedSearchesExpanded: state.savedSearchExpand.isSavedSearchesExpanded
});

const mapDispatchToProps = (dispatch) => ({
    expandSavedSearches: () => dispatch({ type: EXPAND_SAVED_SEARCHES }),
    collapseSavedSearches: () => dispatch({ type: COLLAPSE_SAVED_SEARCHES })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearchButton);
