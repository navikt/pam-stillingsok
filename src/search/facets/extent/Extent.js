import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { SEARCH } from '../../searchReducer';
import {
    CHECK_EXTENT,
    UNCHECK_DEPRECATED_EXTENT,
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

    onDeprecatedExtentClick = (e) => {
        const { value } = e.target;
        this.props.uncheckDeprecatedExtent(value);
        this.props.search();
    };

    render() {
        const { extent, checkedExtent, deprecatedExtent } = this.props;
        let title = 'Heltid/deltid';
        if (checkedExtent.length === 1) {
            title += ' (1 valgt)';
        } else if (checkedExtent.length > 1) {
            title += ` (${checkedExtent.length} valgte)`;
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
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
                        {deprecatedExtent && deprecatedExtent.map((ext) => (
                            <div key={ext}>
                                <Checkbox
                                    name="deprecatedExtent"
                                    label={`${ext} (0)`}
                                    value={ext}
                                    onChange={this.onDeprecatedExtentClick}
                                    checked={checkedExtent.includes(ext)}
                                    disabled={!checkedExtent.includes(ext)}
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
    search: PropTypes.func.isRequired,
    uncheckDeprecatedExtent: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    extent: state.extent.extent,
    checkedExtent: state.extent.checkedExtent,
    deprecatedExtent: state.extent.deprecatedExtent
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkExtent: (value) => dispatch({ type: CHECK_EXTENT, value }),
    uncheckExtent: (value) => dispatch({ type: UNCHECK_EXTENT, value }),
    uncheckDeprecatedExtent: (deprecated) => dispatch({ type: UNCHECK_DEPRECATED_EXTENT, deprecated })
});

export default connect(mapStateToProps, mapDispatchToProps)(Extent);
