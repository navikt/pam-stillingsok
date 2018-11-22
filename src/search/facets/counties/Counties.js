import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import capitalizeLocation from '../../../common/capitalizeLocation';
import { SEARCH } from '../../searchReducer';
import './Counties.less';
import { toFacetTitleWithCount } from '../utils';
import {
    CHECK_COUNTY,
    CHECK_MUNICIPAL,
    UNCHECK_COUNTY,
    UNCHECK_MUNICIPAL
} from './countiesReducer';

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
            <Ekspanderbartpanel
                tittel={toFacetTitleWithCount('Område', checkedCounties.length + checkedMunicipals.length)}
                className="Counties"
                apen
            >
                <div
                    role="group"
                    aria-label="Velg område"
                    className="Counties__inner"
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
                                    className="Counties__inner__municipals"
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
                    {((deprecatedCounties && deprecatedCounties.length > 0)
                        || (deprecatedMunicipals && deprecatedMunicipals.length > 0)) && (
                        <div>
                            <div className="Search__separator" />
                            <Element className="blokk-xs">Følgende kriterier gir 0 treff:</Element>
                        </div>
                    )}
                    {deprecatedCounties && deprecatedCounties.map((county) => (
                        <div key={county}>
                            <Checkbox
                                name="deprecatedLocation"
                                label={`${capitalizeLocation(county)} (0)`}
                                value={county}
                                onChange={this.onCountyClick}
                                checked={checkedCounties.includes(county)}
                            />
                        </div>
                    ))}
                    {deprecatedMunicipals && deprecatedMunicipals.map((municipal) => (
                        <div key={municipal}>
                            <Checkbox
                                name="deprecatedLocation"
                                label={`${capitalizeLocation(municipal.split('.')[1])} (0)`}
                                value={municipal}
                                onChange={this.onMunicipalClick}
                                checked={checkedMunicipals.includes(municipal)}
                            />
                        </div>
                    ))}
                </div>
            </Ekspanderbartpanel>
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
    counties: state.counties.counties,
    checkedCounties: state.counties.checkedCounties,
    checkedMunicipals: state.counties.checkedMunicipals,
    deprecatedCounties: state.counties.deprecatedCounties,
    deprecatedMunicipals: state.counties.deprecatedMunicipals
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkCounty: (county) => dispatch({ type: CHECK_COUNTY, county }),
    uncheckCounty: (county) => dispatch({ type: UNCHECK_COUNTY, county }),
    checkMunicipal: (municipal) => dispatch({ type: CHECK_MUNICIPAL, municipal }),
    uncheckMunicipal: (municipal) => dispatch({ type: UNCHECK_MUNICIPAL, municipal })
});

export default connect(mapStateToProps, mapDispatchToProps)(Counties);

