import {Checkbox} from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import fixLocationName from '../../../server/common/fixLocationName';
import {SearchCriteriaPanels} from './facetPanelsReducer';
import {
    ADD_COUNTRY,
    ADD_COUNTY,
    ADD_MUNICIPAL,
    REMOVE_COUNTRY,
    REMOVE_COUNTY,
    REMOVE_MUNICIPAL, SET_INTERNATIONAL
} from '../searchQueryReducer';
import {SEARCH} from '../searchReducer';
import './Facet.less';
import Facet from './Facet';
import UnknownFacetValues from './UnknownFacetValues';

class Locations extends React.Component {

    onZeroCountFacetClick = (countries, counties, municipals) => (e) => {
        const {value} = e.target;

        if (countries.includes(value)) this.checkUncheckLocation(value, 'country', e.target.checked);
        else if (counties.includes(value)) this.checkUncheckLocation(value, 'county', e.target.checked);
        else if (municipals.includes(value)) this.checkUncheckLocation(value, 'municipal', e.target.checked);
    };

    onCheckboxClick = (key, type) => (e) => {
        this.checkUncheckLocation(key, type, e.target.checked);
    };

    checkUncheckLocation(key, type, checked) {
        if (type === 'county') {
            if (checked) this.props.checkCounty(key);
            else this.props.uncheckCounty(key);
        } else if (type === 'municipal') {
            if (checked) this.props.checkMunicipal(key);
            else this.props.uncheckMunicipal(key);
        } else if (type === 'international') {
            if (this.props.international) {
                this.props.checkedCountries.forEach(c => {
                    this.props.uncheckCountries(c);
                });
            }

            this.props.setInternational(!this.props.international);
        } else {
            if (checked) this.props.checkCountries(key);
            else this.props.uncheckCountries(key);
        }

        this.props.search();
    }

    render() {
        const {
            locations, checkedCounties, checkedMunicipals, checkedCountries, deprecatedCounties,
            international, deprecatedMunicipals, deprecatedCountries
        } = this.props;

        const zeroCountLocations = [...new Set([
            ...deprecatedCountries,
            ...deprecatedCounties,
            ...deprecatedMunicipals,
        ])];

        const checkedLocations = [
            ...checkedCountries,
            ...checkedCounties,
            ...checkedMunicipals,
        ];

        return (
            <Facet
                panelId={SearchCriteriaPanels.COUNTIES_PANEL}
                count={checkedCounties.length + checkedMunicipals.length}
                title="Område"
            >
                {locations && locations.map((location) => (
                    <div key={location.key}>
                        <Checkbox
                            className={location.count === 0 ? 'Facet__zero__count' : ''}
                            name="location"
                            label={`${fixLocationName(location.key)} (${location.count})`}
                            value={location.key}
                            onChange={this.onCheckboxClick(location.key, location.type)}
                            checked={checkedCounties.includes(location.key) || (location.key === 'UTLAND' && international === true)}
                        />
                        {(checkedCounties.includes(location.key) || (location.key === 'UTLAND' && international === true)) && location.key !== 'OSLO' && (
                            <div
                                className="Facet__inner__items"
                                role="group"
                                aria-label={`Underområder ${fixLocationName(location.key)}`}
                            >
                                {location.subLocations && location.subLocations.map((subLocation) => (
                                    <Checkbox
                                        className={subLocation.count === 0 ? 'Facet__zero__count' : ''}
                                        name="location"
                                        key={subLocation.key}
                                        label={`${fixLocationName(subLocation.key, true)} (${subLocation.count})`}
                                        value={subLocation.key}
                                        onChange={this.onCheckboxClick(subLocation.key, subLocation.type)}
                                        checked={checkedMunicipals.includes(subLocation.key) || checkedCountries.includes(subLocation.key)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <UnknownFacetValues
                    splitLocationNameOnDot={true}
                    namePrefix="counties"
                    unknownValues={zeroCountLocations}
                    checkedValues={checkedLocations}
                    onClick={this.onZeroCountFacetClick(deprecatedCountries, deprecatedCounties, deprecatedMunicipals)}
                />
            </Facet>
        );
    }
}

Locations.propTypes = {
    locations: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        type: PropTypes.string,
        count: PropTypes.number,
        subLocations: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string,
            type: PropTypes.string,
            count: PropTypes.number
        }))
    })).isRequired,
    checkedCountries: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkedCounties: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkedMunicipals: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedCounties: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedMunicipals: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedCountries: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkCounty: PropTypes.func.isRequired,
    uncheckCounty: PropTypes.func.isRequired,
    checkMunicipal: PropTypes.func.isRequired,
    uncheckMunicipal: PropTypes.func.isRequired,
    setInternational: PropTypes.func.isRequired,
    international: PropTypes.bool.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    locations: state.facets.locationFacets,
    international: state.searchQuery.international,
    checkedCountries: state.searchQuery.countries,
    checkedCounties: state.searchQuery.counties,
    checkedMunicipals: state.searchQuery.municipals,
    deprecatedCounties: state.unknownFacets.unknownCounties,
    deprecatedMunicipals: state.unknownFacets.unknownMunicipals,
    deprecatedCountries: state.unknownFacets.unknownCountries,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({type: SEARCH}),
    checkCounty: (county) => dispatch({type: ADD_COUNTY, county}),
    uncheckCounty: (county) => dispatch({type: REMOVE_COUNTY, county}),
    checkMunicipal: (municipal) => dispatch({type: ADD_MUNICIPAL, municipal}),
    uncheckMunicipal: (municipal) => dispatch({type: REMOVE_MUNICIPAL, municipal}),
    checkCountries: (value) => dispatch({type: ADD_COUNTRY, value}),
    uncheckCountries: (value) => dispatch({type: REMOVE_COUNTRY, value}),
    setInternational: (value) => dispatch({type: SET_INTERNATIONAL, value}),
});

export default connect(mapStateToProps, mapDispatchToProps)(Locations);
