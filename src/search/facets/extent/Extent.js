import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import {
    SEARCH,
    CHECK_HELTID_DELTID,
    UNCHECK_HELTID_DELTID,
} from "../../domene";

export class Extent extends React.Component {

    onExtentClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkExtent(value);
        } else {
            this.props.uncheckExtent(value);
        }
        this.props.search();
    };

    render() {
        const { heltidDeltid, checkedExtent }  = this.props;
        let title = "Heltid/deltid";
        if (checkedExtent.length === 1) {
            title += " (1 valgt)"
        } else if(checkedExtent.length > 1) {
            title += " ("+checkedExtent.length+" valgte)"
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
                tittelProps="element"
                className="panel--white-bg panel--gray-border blokk-xs"
                apen={checkedExtent.length > 0}
            >
                <div
                    role="group"
                    aria-labelledby="heltid-deltid-filter-header"
                    className="search-page-filter"
                >
                    <div>
                        {heltidDeltid && heltidDeltid.map((item) => (
                            <Checkbox
                                name="heltidDeltid"
                                key={item.key}
                                label={`${item.key} (${item.count})`}
                                value={item.key}
                                onChange={this.onExtentClick}
                                checked={checkedExtent.includes(item.key)}
                            />
                        ))}
                    </div>
                </div>
            </Ekspanderbartpanel>
        );
    }
}

const mapStateToProps = (state) => ({
    heltidDeltid: state.search.heltidDeltid,
    checkedExtent: state.search.query.heltidDeltid
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkExtent: (value) => dispatch({ type: CHECK_HELTID_DELTID, value }),
    uncheckExtent: (value) => dispatch({ type: UNCHECK_HELTID_DELTID, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Extent);