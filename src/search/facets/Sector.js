import { Checkbox } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { ADD_SECTOR, REMOVE_SECTOR } from '../searchQueryReducer';
import { SEARCH } from '../searchReducer';
import Facet from './Facet';
import './Facet.less';
import { SearchCriteriaPanels } from './facetPanelsReducer';
import UnknownFacetValues from './UnknownFacetValues';

class Sector extends React.Component {
    onSectorClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkSector(value);
        } else {
            this.props.uncheckSector(value);
        }
        this.props.search();
    };

    render() {
        const { sector, checkedSector, deprecatedSector } = this.props;
        return (
            <Facet
                panelId={SearchCriteriaPanels.SECTOR_PANEL}
                count={checkedSector.length}
                title="Sektor"
            >
                {sector && sector.map((item) => (
                    <Checkbox
                        name="sector"
                        key={item.key}
                        label={`${item.key} (${item.count})`}
                        value={item.key}
                        onChange={this.onSectorClick}
                        checked={checkedSector.includes(item.key)}
                    />
                ))}
                <UnknownFacetValues
                    namePrefix="sector"
                    unknownValues={deprecatedSector}
                    checkedValues={checkedSector}
                    onClick={this.onSectorClick}
                />
            </Facet>
        );
    }
}

Sector.propTypes = {
    sector: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number
    })).isRequired,
    checkedSector: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedSector: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkSector: PropTypes.func.isRequired,
    uncheckSector: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    checkedSector: state.searchQuery.sector,
    sector: state.facets.sectorFacets,
    deprecatedSector: state.unknownFacets.unknownSectors
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkSector: (value) => dispatch({ type: ADD_SECTOR, value }),
    uncheckSector: (value) => dispatch({ type: REMOVE_SECTOR, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Sector);
