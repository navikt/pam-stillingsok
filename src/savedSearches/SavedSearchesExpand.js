import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DelayedSpinner from '../search/loading/DelayedSpinner';
import NoSavedSearches from './NoSavedSearches';
import './SavedSearchesExpand.less';
import SavedSearchesExpandItem from './SavedSearchesExpandItem';

class SavedSearchesExpand extends React.Component {
    render() {
        return (
            <div className="SavedSearchesExpand">
                {this.props.isFetchingSavedSearches ? (
                    <div className="SavedSearchesExpand__spinner">
                        <DelayedSpinner />
                    </div>
                ) : (
                    <div>
                        {this.props.savedSearches.length === 0 ? (
                            <NoSavedSearches />
                        ) : (
                            <div>
                                <div className="SavedSearchesExpand__columns">
                                    {this.props.savedSearches.map((savedSearch) => (
                                        <SavedSearchesExpandItem
                                            key={savedSearch.uuid}
                                            savedSearch={savedSearch}
                                        />
                                    ))}
                                </div>
                                <div className="SavedSearchesExpand__link-to-saved-searches">
                                    <Link to="/lagrede-sok" className="lenke typo-element">
                                        Endre lagrede søk og varsler
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

SavedSearchesExpand.propTypes = {
    isFetchingSavedSearches: PropTypes.bool.isRequired,
    savedSearches: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    savedSearches: state.savedSearches.savedSearches,
    isFetchingSavedSearches: state.savedSearches.isFetchingSavedSearches
});

export default connect(mapStateToProps)(SavedSearchesExpand);
