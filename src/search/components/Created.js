import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import {
    SEARCH,
    CHECK_CREATED,
    UNCHECK_CREATED,
} from "../search-redux";

export class Created extends React.Component {

    onCreatedClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkCreated(value);
        } else {
            this.props.uncheckCreated(value);
        }
        this.props.search();
    };

    render() {
        const { created, checkedCreated }  = this.props;
        return (
            <div
                className="panel--white-bg panel--gray-border blokk-xs filter-created"
            >
                {created && created.map((item) => (
                    <Checkbox
                        name="created"
                        key={item.key}
                        label={`Nye i dag (${item.count})`}
                        value={item.key}
                        onChange={this.onCreatedClick}
                        checked={checkedCreated.includes(item.key)}
                    />
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    created: state.search.created,
    checkedCreated: state.search.query.created
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkCreated: (value) => dispatch({ type: CHECK_CREATED, value }),
    uncheckCreated: (value) => dispatch({ type: UNCHECK_CREATED, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Created);