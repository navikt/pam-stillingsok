import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import Typeahead from './Typeahead';
import { SEARCH } from '../searchReducer';
import {
    SET_VALUE,
    SELECT_SUGGESTION,
    FETCH_SUGGESTIONS
} from './searchBoxReducer';
import './SearchBox.less';

class SearchBox extends React.Component {
    onChange = (value) => {
        this.props.setValue(value);
        this.props.fetchSuggestions();
    };

    onSelect = (value) => {
        this.props.setValue(value);
        this.props.selectSuggestion(value);
        this.props.search();
    };

    render() {
        return (
            <div className="SearchBox">
                <Typeahead
                    id="search-form-fritekst-input"
                    name="q"
                    autoComplete="off"
                    label=""
                    placeholder="Skriv inn søkeord"
                    onSelect={this.onSelect}
                    onChange={this.onChange}
                    suggestions={this.props.suggestions}
                    value={this.props.value ? this.props.value : ''}
                />
                <Knapp
                    aria-label="søk"
                    id="search-button"
                    className="SearchBox__button"
                    onClick={this.props.onSubmit}
                >
                    <i className="SearchBox__button__icon" />
                </Knapp>
            </div>
        );
    }
}

SearchBox.propTypes = {
    value: PropTypes.string.isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
    search: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    selectSuggestion: PropTypes.func.isRequired,
    fetchSuggestions: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    value: state.searchBox.q,
    suggestions: state.searchBox.suggestions
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setValue: (value) => dispatch({ type: SET_VALUE, value }),
    selectSuggestion: (value) => dispatch({ type: SELECT_SUGGESTION, value }),
    fetchSuggestions: () => dispatch({ type: FETCH_SUGGESTIONS })
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
