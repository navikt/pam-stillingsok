import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import capitalizeLocation from '../../../common/capitalizeLocation';
import { SEARCH } from '../../searchReducer';
import { toFacetTitleWithCount } from '../utils';
import {
    CHECK_COUNTRIES,
    UNCHECK_COUNTRIES
} from './countriesReducer';
import './Countries.less';

class Countries extends React.Component {
    onCountriesClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkCountries(value);
        } else {
            this.props.uncheckCountries(value);
        }
        this.props.search();
    };

    render() {
        const { countries, checkedCountries, deprecatedCountries } = this.props;
        return (
            <Ekspanderbartpanel
                tittel={toFacetTitleWithCount('Land', checkedCountries.length)}
                className="Countries ekspanderbartPanel--green"
                apen
            >
                <div
                    role="group"
                    aria-label="Land"
                    className="Countries__inner"
                >
                    <div>
                        {countries && countries.map((item) => (
                            <Checkbox
                                name="countries"
                                key={item.key}
                                label={`${capitalizeLocation(item.key)} (${item.count})`}
                                value={item.key}
                                onChange={this.onCountriesClick}
                                checked={checkedCountries.includes(item.key)}
                            />
                        ))}
                        {deprecatedCountries && deprecatedCountries.length > 0 && (
                            <div>
                                <div className="Search__separator" />
                                <Element className="blokk-xs">Følgende kriterier gir 0 treff:</Element>
                            </div>
                        )}
                        {deprecatedCountries && deprecatedCountries.map((countries) => (
                            <div key={countries}>
                                <Checkbox
                                    name="deprecatedCountries"
                                    label={`${capitalizeLocation(countries)} (0)`}
                                    value={countries}
                                    onChange={this.onCountriesClick}
                                    checked={checkedCountries.includes(countries)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Ekspanderbartpanel>
        );
    }
}

Countries.propTypes = {
    countries: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number
    })).isRequired,
    checkedCountries: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedCountries: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkCountries: PropTypes.func.isRequired,
    uncheckCountries: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    countries: state.countries.countries,
    checkedCountries: state.countries.checkedCountries,
    deprecatedCountries: state.countries.deprecatedCountries
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkCountries: (value) => dispatch({ type: CHECK_COUNTRIES, value }),
    uncheckCountries: (value) => dispatch({ type: UNCHECK_COUNTRIES, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Countries);
