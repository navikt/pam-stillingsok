import React from 'react';
import { connect } from 'react-redux';
import { Select } from 'nav-frontend-skjema';
import { SEARCH } from '../searchSagas';
import { SET_SORTING } from './sortingReducer';

export class Sorting extends React.Component {
    onSortingChange = (e) => {
        this.props.setSorting(e.target.value);
        this.props.search();
    };

    render() {
        return (
            <Select
                onChange={this.onSortingChange}
                value={this.props.sort}
                label=""
            >
                <option key="relevant" value="relevant">Mest relevant</option>
                <option key="updated" value="updated">Vis nyeste øverst</option>
            </Select>
        );
    }
}

const mapStateToProps = (state) => ({
    sort: state.sorting.sort
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setSorting: (sortField) => dispatch({ type: SET_SORTING, sortField })
});

export default connect(mapStateToProps, mapDispatchToProps)(Sorting);
