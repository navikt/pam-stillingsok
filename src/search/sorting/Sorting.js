import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Select} from 'nav-frontend-skjema';
import {SEARCH} from '../searchReducer';
import {SET_SORTING} from '../searchQueryReducer';
import './Sorting.less';

export function sortingValueToLabel(value) {
    switch (value) {
        case 'relevant':
            return "Mest relevant";
        case 'published':
            return "Vis nyeste øverst";
        case 'expires':
            return "Søknadsfrist";
        default:
            return value

    }
}

class Sorting extends React.Component {
    onSortingChange = (e) => {
        this.props.setSorting(e.target.value);
        this.props.search();
    };

    // TODO: Dropp className="typo-normal" når Select har SourceSansPro som default font.
    render() {
        const {sort, searchObject} = this.props;

        // Gjem sorter dropdown når søket er tomt
        if (searchObject.searchResult !== undefined && searchObject.searchResult.total !== undefined &&
            searchObject.searchResult.total.value === 0) {

            return null;
        }

        return (
            <div className="Sorting">
                <Select
                    onChange={this.onSortingChange}
                    value={sort}
                    label="Sortér etter"
                    aria-label="Sortér treff"
                    className="typo-normal Sorting__Select"
                >
                    <option key="relevant" value="relevant">{sortingValueToLabel('relevant')}</option>
                    <option key="published" value="published">{sortingValueToLabel('published')}</option>
                    <option key="expires" value="expires">{sortingValueToLabel('expires')}</option>
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
    sort: state.searchQuery.sort,
    searchObject: state.search
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({type: SEARCH}),
    setSorting: (sortField) => dispatch({type: SET_SORTING, sortField})
});

export default connect(mapStateToProps, mapDispatchToProps)(Sorting);
