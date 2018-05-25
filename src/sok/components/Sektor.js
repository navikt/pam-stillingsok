import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import {
    SEARCH,
    CHECK_SEKTOR,
    UNCHECK_SEKTOR,
} from "../domene";

export class Sektor extends React.Component {

    onSektorClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkSektor(value);
        } else {
            this.props.uncheckSektor(value);
        }
        this.props.search();
    };

    render() {
        const { sektor, checkedSektor }  = this.props;
        let title = "Sektor";
        if (checkedSektor.length === 1) {
            title += " (1 valgt)"
        } else if(checkedSektor.length > 1) {
            title += " ("+checkedSektor.length+" valgte)"
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
                tittelProps="element"
                className="panel--white-bg panel--gray-border blokk-xs"
                apen={checkedSektor.length > 0}
            >
                <div
                    role="group"
                    aria-labelledby="sektor-filter-header"
                    className="search-page-filter"
                >
                    <div>
                        {sektor && sektor.map((item) => (
                            <Checkbox
                                name="sektor"
                                key={item.key}
                                label={`${item.key} (${item.count})`}
                                value={item.key}
                                onChange={this.onSektorClick}
                                checked={checkedSektor.includes(item.key)}
                            />
                        ))}
                    </div>
                </div>
            </Ekspanderbartpanel>
        );
    }
}

const mapStateToProps = (state) => ({
    sektor: state.sektor,
    checkedSektor: state.query.sektor
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkSektor: (value) => dispatch({ type: CHECK_SEKTOR, value }),
    uncheckSektor: (value) => dispatch({ type: UNCHECK_SEKTOR, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Sektor);