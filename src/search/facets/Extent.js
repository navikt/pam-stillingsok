import { Checkbox } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { SearchCriteriaPanels } from './facetPanelsReducer';
import { ADD_EXTENT, REMOVE_EXTENT } from '../searchQueryReducer';
import { SEARCH } from '../searchReducer';
import './Facet.less';
import Facet from './Facet';
import UnknownFacetValues from './UnknownFacetValues';

class Extent extends React.Component {
    onExtentClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkExtent(value);
        } else {
            this.props.uncheckExtent(value);
        }
        this.props.search();
    };

    labelForExtent = (item) => (
        item.key === 'Heltid'
            ? `${item.key} eller ikke oppgitt (${item.count})`
            : `${item.key} (${item.count})`
    );

    render() {
        const { extent, checkedExtent, deprecatedExtent } = this.props;
        return (
            <Facet
                panelId={SearchCriteriaPanels.EXTENT_PANEL}
                count={checkedExtent.length}
                title="Heltid/deltid"
            >
                {extent && extent.map((item) => (
                    <Checkbox
                        name="extent"
                        key={item.key}
                        label={this.labelForExtent(item)}
                        aria-label={`"Antall stillinger ${this.labelForExtent(item)}"`}
                        value={item.key}
                        onChange={this.onExtentClick}
                        checked={checkedExtent.includes(item.key)}
                    />
                ))}
                <UnknownFacetValues
                    namePrefix="extent"
                    unknownValues={deprecatedExtent}
                    checkedValues={checkedExtent}
                    onClick={this.onExtentClick}
                />
            </Facet>
        );
    }
}

Extent.propTypes = {
    extent: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number
    })).isRequired,
    checkedExtent: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedExtent: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkExtent: PropTypes.func.isRequired,
    uncheckExtent: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    extent: state.facets.extentFacets,
    checkedExtent: state.searchQuery.extent,
    deprecatedExtent: state.unknownFacets.unknownExtents
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkExtent: (value) => dispatch({ type: ADD_EXTENT, value }),
    uncheckExtent: (value) => dispatch({ type: REMOVE_EXTENT, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Extent);
