import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { SEARCH } from '../../domene';
import {
    CHECK_COUNTY,
    UNCHECK_COUNTY,
    CHECK_MUNICIPAL,
    UNCHECK_MUNICIPAL
} from './counties-redux';
import './counties.less';

export class Counties extends React.Component {
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

    static renderTitleWithCount(title, count) {
        if (count === 1) {
            return `${title} (1 valgt)`;
        } else if (count > 1) {
            return `${title} (${count} valgte)`;
        } else {
            return title;
        }
    }

    render() {
        const { counties, checkedCounties, checkedMunicipals } = this.props;
        return (
            <Ekspanderbartpanel
                tittel={Counties.renderTitleWithCount('Fylke/kommune', checkedCounties.length + checkedMunicipals.length)}
                tittelProps="element"
                className="Counties"
                apen
            >
                <div role="group">
                    {counties && counties.map((county) => (
                        <div key={county.key} className="Counties__county">
                            <Checkbox
                                name="county"
                                label={`${county.key} (${county.count})`}
                                value={county.key}
                                onChange={this.onCountyClick}
                                checked={checkedCounties.includes(county.key)}
                            />
                            {checkedCounties && checkedCounties.includes(county.key) && county.key !== 'OSLO' && (
                                <div className="Counties__county__municipals">
                                    {county.municipals && county.municipals.map((municipal) => (
                                        <Checkbox
                                            name="municipal"
                                            key={municipal.key}
                                            label={`${municipal.key} (${municipal.count})`}
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
    counties: PropTypes.arrayOf(PropTypes.object).isRequired,
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

