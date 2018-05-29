import React from 'react';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import Counties from '../../facets/counties/Counties';
import HeltidDeltid from './HeltidDeltid';
import EngagementType from './EngagementType'
import Sector from './Sector';
import Created from './Created';
import SearchTypeAhead from './SearchTypeAhead';
import {
    SEARCH
} from "../search-redux";

export class SearchForm extends React.Component {

    onSearchFormSubmit = (e) => {
        e.preventDefault();
        this.props.search();
    };

    render() {
        return (
            <form
                role="search"
                id="search-form"
                name="filter"
                action="/"
                method="get"
                onSubmit={this.onSearchFormSubmit}
            >
                <div id="search-form-fritekst-input-wrapper">
                    <SearchTypeAhead />
                    <Knapp
                        aria-label="søk"
                        id="search-button"
                        className="knapp search-button"
                        onClick={this.onSearchFormSubmit}
                    >
                        <i className="search-button__icon"/>
                    </Knapp>
                    <a
                        href="#sokeresultat"
                        className="typo-normal lenke sr-only sr-only-focusable"
                    >
                        Hopp til søkeresultat
                    </a>
                </div>
                <Created />
                <Counties />
                <HeltidDeltid />
                <EngagementType />
                <Sector />
            </form>
        );
    }
}

const mapStateToProps = (state) => ({
    // No props
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH })
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
