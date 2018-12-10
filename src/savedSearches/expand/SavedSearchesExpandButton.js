import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import './SavedSearchesExpand.less';
import Chevron from 'nav-frontend-chevron';
import SavedSearchesExpand from './SavedSearchesExpand';
import { COLLAPSE_SAVED_SEARCHES, EXPAND_SAVED_SEARCHES } from './savedSearchExpandReducer';

class SavedSearchesExpandButton extends React.Component {
    onClick = () => {
        if (this.props.isSavedSearchesExpanded) {
            this.props.collapseSavedSearches();
            document.body.classList.remove('screen-xs-no-scroll');
        } else {
            this.props.expandSavedSearches();
            document.body.classList.add('screen-xs-no-scroll');
        }
    };

    onCloseButton = () => {
        this.props.collapseSavedSearches();
        document.body.classList.remove('screen-xs-no-scroll');
    };

    render() {
        const { isFetching, savedSearches, isSavedSearchesExpanded } = this.props;

        const count = !isFetching ? savedSearches.length : 0;
        return (
            <div className="SavedSearchesExpand__container">
                <span className="typo-normal">
                    Du har {count}
                </span>
                <button
                    type="button"
                    className="SavedSearchesExpand__button typo-element"
                    onClick={this.onClick}
                    aria-expanded={isSavedSearchesExpanded}
                >
                    {count === 1 ? 'lagret søk' : 'lagrede søk'}
                    <Chevron
                        className="SavedSearchesExpand__chevron"
                        type={isSavedSearchesExpanded ? 'opp' : 'ned'}
                    />
                </button>
                {isSavedSearchesExpanded && (
                    <SavedSearchesExpand onCloseButton={this.onCloseButton} />
                )}
            </div>
        );
    }
}


SavedSearchesExpandButton.propTypes = {
    savedSearches: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFetching: PropTypes.bool.isRequired,
    isSavedSearchesExpanded: PropTypes.bool.isRequired,
    expandSavedSearches: PropTypes.func.isRequired,
    collapseSavedSearches: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    savedSearches: state.savedSearches.savedSearches,
    isFetching: state.savedSearches.isFetching,
    isSavedSearchesExpanded: state.savedSearchExpand.isSavedSearchesExpanded,

});

const mapDispatchToProps = (dispatch) => ({
    expandSavedSearches: () => dispatch({ type: EXPAND_SAVED_SEARCHES }),
    collapseSavedSearches: () => dispatch({ type: COLLAPSE_SAVED_SEARCHES })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearchesExpandButton);
