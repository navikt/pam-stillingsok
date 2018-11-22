import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { SEARCH } from '../../searchReducer';
import { toFacetTitleWithCount } from '../utils';
import {
    CHECK_EXTENT,
    UNCHECK_EXTENT
} from './extentReducer';
import './Extent.less';

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

    render() {
        const { extent, checkedExtent, deprecatedExtent } = this.props;
        return (
            <Ekspanderbartpanel
                tittel={toFacetTitleWithCount('Heltid/deltid', checkedExtent.length)}
                className="Extent"
                apen
            >
                <div
                    role="group"
                    aria-label="Heltid/deltid"
                    className="Extent__inner"
                >
                    <div>
                        {extent && extent.map((item) => (
                            <Checkbox
                                name="extent"
                                key={item.key}
                                label={`${item.key} (${item.count})`}
                                value={item.key}
                                onChange={this.onExtentClick}
                                checked={checkedExtent.includes(item.key)}
                            />
                        ))}
                        {deprecatedExtent && deprecatedExtent.length > 0 && (
                            <div>
                                <div className="Search__separator" />
                                <Element className="blokk-xs">Følgende kriterier gir 0 treff:</Element>
                            </div>
                        )}
                        {deprecatedExtent && deprecatedExtent.map((ext) => (
                            <div key={ext}>
                                <Checkbox
                                    name="deprecatedExtent"
                                    label={`${ext} (0)`}
                                    value={ext}
                                    onChange={this.onExtentClick}
                                    checked={checkedExtent.includes(ext)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Ekspanderbartpanel>
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
    extent: state.extent.extent,
    checkedExtent: state.extent.checkedExtent,
    deprecatedExtent: state.extent.deprecatedExtent
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkExtent: (value) => dispatch({ type: CHECK_EXTENT, value }),
    uncheckExtent: (value) => dispatch({ type: UNCHECK_EXTENT, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Extent);
