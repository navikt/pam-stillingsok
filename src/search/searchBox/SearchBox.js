import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SET_SEARCH_STRING } from '../searchQueryReducer';
import Typeahead from './Typeahead';
import { SEARCH } from '../searchReducer';
import { FETCH_SUGGESTIONS } from './searchBoxReducer';
import './SearchBox.less';


class SearchBox extends React.Component {
    /**
     * Fetcher typehead-forslag hver gang man legger til
     * eller fjerner en bokstav i typehead'en.
     * @param value
     */
    onTypeAheadValueChange = (value) => {
        this.props.setValue(value);
        this.props.fetchSuggestions();
    };

    /**
     * Gjør et søk når man velger et forslag i typehead'en
     * @param value
     */
    onTypeAheadSuggestionSelected = (value) => {
        this.props.setValue(value);
        this.props.search();
    };

    render() {
        return (
            <div>
                <h2 className="SearchBox__h2">
                    Søk blant ledige stillinger
                </h2>
                <div className="SearchBox">
                    <Typeahead
                        id="search-form-fritekst-input"
                        name="q"
                        autoComplete="off"
                        ariaLabel="Søk"
                        placeholder="Søk"
                        onSelect={this.onTypeAheadSuggestionSelected}
                        onChange={this.onTypeAheadValueChange}
                        suggestions={this.props.suggestions}
                        value={this.props.value ? this.props.value : ''}
                    />
                    <button
                        type="submit"
                        className="SearchBox__button"
                    >
                        <span className="SearchBox__button__icon">
                            <span className="sr-only">Søk</span>
                        </span>
                    </button>
                </div>
            </div>
        );
    }
}

SearchBox.propTypes = {
    value: PropTypes.string.isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
    search: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    fetchSuggestions: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    value: state.searchQuery.q,
    suggestions: state.searchBox.suggestions
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setValue: (value) => dispatch({ type: SET_SEARCH_STRING, value }),
    fetchSuggestions: () => dispatch({ type: FETCH_SUGGESTIONS })
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
