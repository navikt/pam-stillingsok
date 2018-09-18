import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select } from 'nav-frontend-skjema';
import { SEARCH } from '../searchReducer';
import { SET_SORTING } from './sortingReducer';
import './Sorting.less';

class Sorting extends React.Component {
    onSortingChange = (e) => {
        this.props.setSorting(e.target.value);
        this.props.search();
    };

    // TODO: Dropp className="typo-normal" når Select har SourceSansPro som default font.
    render() {
        return (
            <div className="Sorting">
                <Select
                    onChange={this.onSortingChange}
                    value={this.props.sort}
                    label="Sortér treff:"
                    className="typo-normal Sorting__Select"
                >
                    <option key="relevant" value="relevant">Mest relevant</option>
                    <option key="updated" value="updated">Vis nyeste øverst</option>
                </Select>
            </div>
        );
    }
}

Sorting.propTypes = {
    sort: PropTypes.string.isRequired,
    search: PropTypes.func.isRequired,
    setSorting: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    sort: state.sorting.sort
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setSorting: (sortField) => dispatch({ type: SET_SORTING, sortField })
});

export default connect(mapStateToProps, mapDispatchToProps)(Sorting);
