import React from 'react';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import {
    SEARCH,
    SET_TYPE_AHEAD_VALUE,
    SELECT_TYPE_AHEAD_VALUE,
    FETCH_TYPE_AHEAD_SUGGESTIONS
} from '../domene';
import Typeahead from './Typeahead';

export class SearchBox extends React.Component {
    onTypeAheadChange = (value) => {
        this.props.setSearchString(value);
        this.props.fetchTypeAheadSuggestions();
    };

    onTypeAheadSelect = (value) => {
        this.props.setSearchString(value);
        this.props.selectTypeAheadValue(value);
        this.props.search();
    };

    render() {
        return (
            <div>
                <Typeahead
                    id="search-form-fritekst-input"
                    className="skjemaelement__input input--fullbredde"
                    name="q"
                    autoComplete="off"
                    label=""
                    placeholder="Skriv inn søkeord"
                    onSelect={this.onTypeAheadSelect}
                    onChange={this.onTypeAheadChange}
                    suggestions={this.props.suggestions}
                    value={this.props.value ? this.props.value : ''}
                />
                <Knapp
                    aria-label="søk"
                    id="search-button"
                    className="knapp search-button"
                    onClick={this.props.onSubmit}
                >
                    <i className="search-button__icon" />
                </Knapp>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    value: state.search.query.q,
    suggestions: state.search.typeAheadSuggestions
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setSearchString: (value) => dispatch({ type: SET_TYPE_AHEAD_VALUE, value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE, value }),
    fetchTypeAheadSuggestions: () => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS })
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
