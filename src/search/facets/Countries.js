import { Checkbox } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import fixLocationName from '../../../server/common/fixLocationName';
import { ADD_COUNTRY, REMOVE_COUNTRY } from '../searchQueryReducer';
import { SEARCH } from '../searchReducer';
import Facet from './Facet';
import './Facet.less';
import { SearchCriteriaPanels } from './facetPanelsReducer';
import UnknownFacetValues from './UnknownFacetValues';

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
            <Facet
                panelId={SearchCriteriaPanels.COUNTRIES_PANEL}
                count={checkedCountries.length}
                title="Land"
            >
                {countries && countries.map((item) => (
                    <Checkbox
                        name="countries"
                        key={item.key}
                        label={`${fixLocationName(item.key)} (${item.count})`}
                        value={item.key}
                        onChange={this.onCountriesClick}
                        checked={checkedCountries.includes(item.key)}
                    />
                ))}
                <UnknownFacetValues
                    namePrefix="countries"
                    unknownValues={deprecatedCountries}
                    checkedValues={checkedCountries}
                    onClick={this.onCountriesClick}
                />
            </Facet>
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
    countries: state.facets.countryFacets,
    checkedCountries: state.searchQuery.countries,
    deprecatedCountries: state.unknownFacets.unknownCountries
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkCountries: (value) => dispatch({ type: ADD_COUNTRY, value }),
    uncheckCountries: (value) => dispatch({ type: REMOVE_COUNTRY, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Countries);
