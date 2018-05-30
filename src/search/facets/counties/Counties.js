import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import {
    SEARCH,
    CHECK_COUNTY,
    UNCHECK_COUNTY,
    CHECK_MUNICIPAL,
    UNCHECK_MUNICIPAL
} from "../../domene";

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

    render() {
        const { counties, checkedCounties, checkedMunicipals } = this.props;
        let title = "Fylke/kommune";
        if ((checkedCounties.length + checkedMunicipals.length) === 1) {
            title += " (1 valgt)"
        } else if((checkedCounties.length + checkedMunicipals.length) > 1) {
            title += " (" + (checkedCounties.length + checkedMunicipals.length) + " valgte)"
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
                tittelProps="element"
                className="panel--white-bg panel--gray-border blokk-xs"
                apen
            >
                <div
                    role="group"
                    aria-labelledby="location-filter-header"
                    className="search-page-filter"
                >
                    <div className="filter-counties">
                        {counties && counties.map((county) => (
                            <div key={county.key}>
                                <Checkbox
                                    name="county"
                                    label={`${county.key} (${county.count})`}
                                    value={county.key}
                                    onChange={this.onCountyClick}
                                    checked={checkedCounties.includes(county.key)}
                                />
                                {checkedCounties && checkedCounties.includes(county.key) && county.key !== 'OSLO' && (
                                    <div className="filter-municipals">
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
                </div>
            </Ekspanderbartpanel>
        );
    }
}

const mapStateToProps = (state) => ({
    counties: state.search.counties,
    checkedCounties: state.search.query.counties,
    checkedMunicipals: state.search.query.municipals,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkCounty: (county) => dispatch({ type: CHECK_COUNTY, county }),
    uncheckCounty: (county) => dispatch({ type: UNCHECK_COUNTY, county }),
    checkMunicipal: (municipal) => dispatch({ type: CHECK_MUNICIPAL, municipal }),
    uncheckMunicipal: (municipal) => dispatch({ type: UNCHECK_MUNICIPAL, municipal })
});

export default connect(mapStateToProps, mapDispatchToProps)(Counties);

