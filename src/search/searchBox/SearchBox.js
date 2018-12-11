import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import Typeahead from './Typeahead';
import { SEARCH } from '../searchReducer';
import { FETCH_SUGGESTIONS, SET_VALUE } from './searchBoxReducer';
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
                <div className="SearchBox">
                    <Typeahead
                        id="search-form-fritekst-input"
                        name="q"
                        autoComplete="off"
                        ariaLabel="Søk"
                        placeholder={`Søk i ledige annonser`}
                        onSelect={this.onTypeAheadSuggestionSelected}
                        onChange={this.onTypeAheadValueChange}
                        suggestions={this.props.suggestions}
                        value={this.props.value ? this.props.value : ''}
                    />
                    <Knapp
                        mini
                        type="submit"
                        className="SearchBox__button"
                    >
                        <i aria-label="Søk" className="SearchBox__button__icon" />
                    </Knapp>
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
    value: state.searchBox.q,
    suggestions: state.searchBox.suggestions
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setValue: (value) => dispatch({ type: SET_VALUE, value }),
    fetchSuggestions: () => dispatch({ type: FETCH_SUGGESTIONS })
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
