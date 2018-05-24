import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import {
    SEARCH,
    CHECK_NYE_I_DAG,
    UNCHECK_NYE_I_DAG,
} from "../domene";

export class NyeIDag extends React.Component {

    onNyeIDagClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkNyeIDag(value);
        } else {
            this.props.uncheckNyeIDag(value);
        }
        this.props.search();
    };

    render() {
        const { nyeIDag, checkedNyeIDag }  = this.props;
        return (
            <div
                className="panel--white-bg panel--gray-border blokk-xs"
            >
                <div
                    className="filter-nye-i-dag"
                >
                    <div>
                        {nyeIDag && nyeIDag.map((item) => (
                            <Checkbox
                                name="nyeIDag"
                                key={item.key}
                                label={`${item.key} (${item.count})`}
                                value={item.key}
                                onChange={this.onNyeIDagClick}
                                checked={checkedNyeIDag.includes(item.key)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    nyeIDag: state.nyeIDag,
    checkedNyeIDag: state.query.nyeIDag
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkNyeIDag: (value) => dispatch({ type: CHECK_NYE_I_DAG, value }),
    uncheckNyeIDag: (value) => dispatch({ type: UNCHECK_NYE_I_DAG, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(NyeIDag);