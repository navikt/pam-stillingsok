import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import {
    SEARCH,
    CHECK_HELTID_DELTID,
    UNCHECK_HELTID_DELTID,
} from "../domene";

export class HeltidDeltid extends React.Component {

    onHeltidDeltidClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkHeltidDeltid(value);
        } else {
            this.props.uncheckHeltidDeltid(value);
        }
        this.props.search();
    };

    render() {
        const { heltidDeltid, checkedHeltidDeltid }  = this.props;
        let title = "Heltid/deltid";
        if (checkedHeltidDeltid.length === 1) {
            title += " (1 valgt)"
        } else if(checkedHeltidDeltid.length > 1) {
            title += " ("+checkedHeltidDeltid.length+" valgte)"
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
                tittelProps="element"
                className="panel--white-bg panel--gray-border blokk-xs"
                apen={checkedHeltidDeltid.length > 0}
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
                                onChange={this.onHeltidDeltidClick}
                                checked={checkedHeltidDeltid.includes(item.key)}
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
    checkedHeltidDeltid: state.search.query.heltidDeltid
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkHeltidDeltid: (value) => dispatch({ type: CHECK_HELTID_DELTID, value }),
    uncheckHeltidDeltid: (value) => dispatch({ type: UNCHECK_HELTID_DELTID, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(HeltidDeltid);