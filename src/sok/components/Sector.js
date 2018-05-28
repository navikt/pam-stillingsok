import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import {
    SEARCH,
    CHECK_SECTOR,
    UNCHECK_SECTOR,
} from "../domene";

export class Sector extends React.Component {

    onSectorClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkSector(value);
        } else {
            this.props.uncheckSector(value);
        }
        this.props.search();
    };

    render() {
        const { sector, checkedSector }  = this.props;
        let title = "Sektor";
        if (checkedSector.length === 1) {
            title += " (1 valgt)"
        } else if(checkedSector.length > 1) {
            title += " ("+checkedSector.length+" valgte)"
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
                tittelProps="element"
                className="panel--white-bg panel--gray-border blokk-xs"
                apen={checkedSector.length > 0}
            >
                <div
                    role="group"
                    aria-labelledby="sector-filter-header"
                    className="search-page-filter"
                >
                    <div>
                        {sector && sector.map((item) => (
                            <Checkbox
                                name="sector"
                                key={item.key}
                                label={`${item.key} (${item.count})`}
                                value={item.key}
                                onChange={this.onSectorClick}
                                checked={checkedSector.includes(item.key)}
                            />
                        ))}
                    </div>
                </div>
            </Ekspanderbartpanel>
        );
    }
}

const mapStateToProps = (state) => ({
    sector: state.sector,
    checkedSector: state.query.sector
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkSector: (value) => dispatch({ type: CHECK_SECTOR, value }),
    uncheckSector: (value) => dispatch({ type: UNCHECK_SECTOR, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Sector);