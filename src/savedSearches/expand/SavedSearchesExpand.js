import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Element } from 'nav-frontend-typografi';
import Lukknapp from 'nav-frontend-lukknapp';
import DelayedSpinner from '../../common/DelayedSpinner';
import NoSavedSearches from '../noresult/NoSavedSearches';
import './SavedSearchesExpand.less';
import SavedSearchesExpandItem from './SavedSearchesExpandItem';
import { COLLAPSE_SAVED_SEARCHES } from './savedSearchExpandReducer';

class SavedSearchesExpand extends React.Component {
    componentWillUnmount() {
        this.props.collapse();
    }

    render() {
        const { isFetching, savedSearches, onCloseButton } = this.props;
        return (
            <div>
                <div className="panel SavedSearches__panel">
                    <Lukknapp
                        className="SavedSearches__close"
                        aria-label="Lukk lagrede søk"
                        onClick={onCloseButton}
                        overstHjorne
                    >
                        Lukk lagrede søk
                    </Lukknapp>
                    {isFetching ? (
                        <div className="SavedSearchesExpand__spinner">
                            <DelayedSpinner />
                        </div>
                    ) : (
                        <div>
                            {savedSearches.length === 0 ? (
                                <NoSavedSearches showButton={false} />
                            ) : (
                                <div>
                                    <div className="SavedSearchesExpand__panel__inner">
                                        <Element>Mine lagrede søk</Element>
                                        <ul className="SavedSearchesExpand__list">
                                            {savedSearches.map((savedSearch) => (
                                                <SavedSearchesExpandItem
                                                    key={savedSearch.uuid}
                                                    savedSearch={savedSearch}
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

SavedSearchesExpand.propTypes = {
    collapse: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    savedSearches: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired,
    onCloseButton: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    savedSearches: state.savedSearches.savedSearches,
    isFetching: state.savedSearches.isFetching
});

const mapDispatchToProps = (dispatch) => ({
    collapse: () => dispatch({ type: COLLAPSE_SAVED_SEARCHES })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearchesExpand);
