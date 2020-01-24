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

    onCheckboxClick = (key, type) => (e) => {
        // Spesialhåndtering for deprecated counties/municipals
        if (key === null) {
            const {value} = e.target;
            key = value;
        }

        if (type === 'county') {
            if (e.target.checked) this.props.checkCounty(key);
            else this.props.uncheckCounty(key);
        } else if (type === 'municipal') {
            if (e.target.checked) this.props.checkMunicipal(key);
            else this.props.uncheckMunicipal(key);
        } else if (type === 'international') {
            if (this.props.international) {
                this.props.checkedCountries.forEach(c => {
                    this.props.uncheckCountries(c);
                });
            }

            this.props.setInternational(!this.props.international);
        } else {
            if (e.target.checked) this.props.checkCountries(key);
            else this.props.uncheckCountries(key);

            console.log(this.props.checkedCountries);
        }

        this.props.search();
    };

    render() {
        const {
            locations, checkedCounties, checkedMunicipals, checkedCountries, deprecatedCounties,
            international, deprecatedMunicipals
        } = this.props;

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
                    namePrefix="counties"
                    unknownValues={deprecatedCounties}
                    checkedValues={checkedCounties}
                    onClick={this.onCheckboxClick(null, 'county')}
                    unknownNestedValues={deprecatedMunicipals}
                    checkedNestedValues={checkedMunicipals}
                    onNestedLevelClick={this.onCheckboxClick(null, 'municipal')}
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
    deprecatedMunicipals: state.unknownFacets.unknownMunicipals
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
