import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import capitalizeLocation from '../../../common/capitalizeLocation';
import { SEARCH } from '../../searchReducer';
import {
    CHECK_COUNTY,
    UNCHECK_COUNTY,
    CHECK_MUNICIPAL,
    UNCHECK_MUNICIPAL
} from './countiesReducer';
import './Counties.less';

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
        const { counties, checkedCounties, checkedMunicipals } = this.props;
        let title = 'Område';
        if ((checkedCounties.length + checkedMunicipals.length) === 1) {
            title += ' (1 valgt)';
        } else if ((checkedCounties.length + checkedMunicipals.length) > 1) {
            title += ` (${checkedCounties.length + checkedMunicipals.length} valgte)`;
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
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
                                            label={`${capitalizeLocation(municipal.key)} (${municipal.count})`}
                                            value={municipal.key}
                                            onChange={this.onMunicipalClick}
                                            checked={checkedMunicipals.includes(municipal.key)}
                                        />
                                    ))}
                                </div>
                            )}
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
    checkCounty: PropTypes.func.isRequired,
    uncheckCounty: PropTypes.func.isRequired,
    checkMunicipal: PropTypes.func.isRequired,
    uncheckMunicipal: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    counties: state.counties.counties,
    checkedCounties: state.counties.checkedCounties,
    checkedMunicipals: state.counties.checkedMunicipals
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkCounty: (county) => dispatch({ type: CHECK_COUNTY, county }),
    uncheckCounty: (county) => dispatch({ type: UNCHECK_COUNTY, county }),
    checkMunicipal: (municipal) => dispatch({ type: CHECK_MUNICIPAL, municipal }),
    uncheckMunicipal: (municipal) => dispatch({ type: UNCHECK_MUNICIPAL, municipal })
});

export default connect(mapStateToProps, mapDispatchToProps)(Counties);

