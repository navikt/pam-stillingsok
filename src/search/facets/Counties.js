import { Checkbox } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { capitalizeLocation } from '../../common/utils/capitalizeLocation';
import { SearchCriteriaPanels } from './facetPanelsReducer';
import { ADD_COUNTY, ADD_MUNICIPAL, REMOVE_COUNTY, REMOVE_MUNICIPAL } from '../searchQueryReducer';
import { SEARCH } from '../searchReducer';
import './Facet.less';
import Facet from './Facet';
import UnknownFacetValues from './UnknownFacetValues';

class Counties extends React.Component {
    onCountyClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkCounty(value);
        } else {
            this.props.uncheckCounty(value);
        }
        this.props.search();
    };

    onMunicipalClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkMunicipal(value);
        } else {
            this.props.uncheckMunicipal(value);
        }
        this.props.search();
    };

    render() {
        const {
            counties, checkedCounties, checkedMunicipals, deprecatedCounties, deprecatedMunicipals
        } = this.props;
        return (
            <Facet
                panelId={SearchCriteriaPanels.COUNTIES_PANEL}
                count={checkedCounties.length + checkedMunicipals.length}
                title="Område"
            >
                {counties && counties.map((county) => (
                    <div key={county.key}>
                        <Checkbox
                            name="location"
                            label={`${capitalizeLocation(county.key)} (${county.count})`}
                            value={county.key}
                            onChange={this.onCountyClick}
                            checked={checkedCounties.includes(county.key)}
                        />
                        {checkedCounties && checkedCounties.includes(county.key) && county.key !== 'OSLO' && (
                            <div
                                className="Facet__inner__items"
                                role="group"
                                aria-label={`Underområder ${capitalizeLocation(county.key)}`}
                            >
                                {county.municipals && county.municipals.map((municipal) => (
                                    <Checkbox
                                        name="location"
                                        key={municipal.key}
                                        label={`${capitalizeLocation(municipal.label)} (${municipal.count})`}
                                        value={municipal.key}
                                        onChange={this.onMunicipalClick}
                                        checked={checkedMunicipals.includes(municipal.key)}
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
                    onClick={this.onCountyClick}
                    unknownNestedValues={deprecatedMunicipals}
                    checkedNestedValues={checkedMunicipals}
                    onNestedLevelClick={this.onMunicipalClick}
                />
            </Facet>
        );
    }
}

Counties.propTypes = {
    counties: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number,
        municipals: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number
        }))
    })).isRequired,
    checkedCounties: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkedMunicipals: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedCounties: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedMunicipals: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkCounty: PropTypes.func.isRequired,
    uncheckCounty: PropTypes.func.isRequired,
    checkMunicipal: PropTypes.func.isRequired,
    uncheckMunicipal: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    counties: state.facets.countyFacets,
    checkedCounties: state.searchQuery.counties,
    checkedMunicipals: state.searchQuery.municipals,
    deprecatedCounties: state.unknownFacets.unknownCounties,
    deprecatedMunicipals: state.unknownFacets.unknownMunicipals
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkCounty: (county) => dispatch({ type: ADD_COUNTY, county }),
    uncheckCounty: (county) => dispatch({ type: REMOVE_COUNTY, county }),
    checkMunicipal: (municipal) => dispatch({ type: ADD_MUNICIPAL, municipal }),
    uncheckMunicipal: (municipal) => dispatch({ type: REMOVE_MUNICIPAL, municipal })
});

export default connect(mapStateToProps, mapDispatchToProps)(Counties);
