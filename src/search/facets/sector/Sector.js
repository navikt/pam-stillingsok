import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { SEARCH } from '../../searchReducer';
import './Sector.less';
import { toFacetTitleWithCount } from '../utils';
import { CHECK_SECTOR, UNCHECK_SECTOR, TOGGLE_SECTOR_PANEL_OPEN } from './sectorReducer';

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
        const { sector, checkedSector, deprecatedSector, togglePanelOpen, panelOpen } = this.props;
        return (
            <Ekspanderbartpanel
                tittel={toFacetTitleWithCount('Sektor', checkedSector.length)}
                className="Sector ekspanderbartPanel--green"
                onClick={togglePanelOpen}
                apen={panelOpen}
            >
                <div
                    role="group"
                    aria-label="Sektor"
                    className="Sector__inner"
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
                    {deprecatedSector && deprecatedSector.length > 0 && (
                        <div>
                            <div className="Search__separator" />
                            <Element className="blokk-xs">Følgende kriterier gir 0 treff:</Element>
                        </div>
                    )}
                    {deprecatedSector && deprecatedSector.map((sec) => (
                        <div key={sec}>
                            <Checkbox
                                name="deprecatedSector"
                                label={`${sec} (0)`}
                                value={sec}
                                onChange={this.onSectorClick}
                                checked={checkedSector.includes(sec)}
                            />
                        </div>
                    ))}
                </div>
            </Ekspanderbartpanel>
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
    search: PropTypes.func.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    panelOpen: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    sector: state.sector.sector,
    checkedSector: state.sector.checkedSector,
    deprecatedSector: state.sector.deprecatedSector,
    panelOpen: state.sector.sectorPanelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkSector: (value) => dispatch({ type: CHECK_SECTOR, value }),
    uncheckSector: (value) => dispatch({ type: UNCHECK_SECTOR, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_SECTOR_PANEL_OPEN })
});

export default connect(mapStateToProps, mapDispatchToProps)(Sector);
