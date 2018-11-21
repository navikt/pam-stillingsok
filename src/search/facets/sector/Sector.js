import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { SEARCH } from '../../searchReducer';
import {
    CHECK_SECTOR,
    UNCHECK_DEPRECATED_SECTOR,
    UNCHECK_SECTOR
} from './sectorReducer';
import './Sector.less';

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

    onDeprecatedSectorClick = (e) => {
        const { value } = e.target;
        this.props.uncheckDeprecatedSector(value);
        this.props.search();
    };

    render() {
        const { sector, checkedSector, deprecatedSector } = this.props;
        let title = 'Sektor';
        if (checkedSector.length === 1) {
            title += ' (1 valgt)';
        } else if (checkedSector.length > 1) {
            title += ` (${checkedSector.length} valgte)`;
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
                className="Sector"
                apen
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
                    {deprecatedSector && deprecatedSector.map((sec) => (
                        <div key={sec}>
                            <Checkbox
                                name="deprecatedSector"
                                label={<span>{sec}<span className="Search__expiredText"> (Utgått)</span></span>}
                                value={sec}
                                onChange={this.onDeprecatedSectorClick}
                                checked={checkedSector.includes(sec)}
                                disabled={!checkedSector.includes(sec)}
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
    uncheckDeprecatedSector: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    sector: state.sector.sector,
    checkedSector: state.sector.checkedSector,
    deprecatedSector: state.sector.deprecatedSector
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkSector: (value) => dispatch({ type: CHECK_SECTOR, value }),
    uncheckSector: (value) => dispatch({ type: UNCHECK_SECTOR, value }),
    uncheckDeprecatedSector: (deprecated) => dispatch({ type: UNCHECK_DEPRECATED_SECTOR, deprecated })
});

export default connect(mapStateToProps, mapDispatchToProps)(Sector);
