import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select } from 'nav-frontend-skjema';
import { SET_FAVOURITES_SORTING } from '../favouritesReducer';
import './Sorting.less';

class Sorting extends React.Component {
    onSortingChange = (e) => {
        this.props.setSorting(e.target.value);
    };

    // TODO: Dropp className="typo-normal" når Select har SourceSansPro som default font.
    render() {
        return (
            <div className="Sorting">
                <Select
                    onChange={this.onSortingChange}
                    value={this.props.sort}
                    label="Sortér etter"
                    className="typo-normal Sorting__Select"
                >
                    <option key="published" value="published">Vis nyeste øverst</option>
                    <option key="expires" value="expires">Søknadsfrist</option>
                </Select>
            </div>
        );
    }
}

Sorting.propTypes = {
    sort: PropTypes.string.isRequired,
    setSorting: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    sort: state.favourites.sortField
});

const mapDispatchToProps = (dispatch) => ({
    setSorting: (sortField) => dispatch({ type: SET_FAVOURITES_SORTING, sortField })
});

export default connect(mapStateToProps, mapDispatchToProps)(Sorting);
