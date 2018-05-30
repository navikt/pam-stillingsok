import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { SEARCH } from '../../searchSagas';
import {
    CHECK_EXTENT,
    UNCHECK_EXTENT
} from './extentReducer';

export class Extent extends React.Component {
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
        const { extent, checkedExtent } = this.props;
        let title = 'Heltid/deltid';
        if (checkedExtent.length === 1) {
            title += ' (1 valgt)';
        } else if (checkedExtent.length > 1) {
            title += ` (${checkedExtent.length} valgte)`;
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
                tittelProps="element"
                className="panel--white-bg panel--gray-border blokk-xs"
                apen={checkedExtent.length > 0}
            >
                <div
                    role="group"
                    aria-labelledby="heltid-deltid-filter-header"
                    className="search-page-filter"
                >
                    <div>
                        {extent && extent.map((item) => (
                            <Checkbox
                                name="heltidDeltid"
                                key={item.key}
                                label={`${item.key} (${item.count})`}
                                value={item.key}
                                onChange={this.onExtentClick}
                                checked={checkedExtent.includes(item.key)}
                            />
                        ))}
                    </div>
                </div>
            </Ekspanderbartpanel>
        );
    }
}

const mapStateToProps = (state) => ({
    extent: state.extent.extent,
    checkedExtent: state.extent.checkedExtent
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkExtent: (value) => dispatch({ type: CHECK_EXTENT, value }),
    uncheckExtent: (value) => dispatch({ type: UNCHECK_EXTENT, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Extent);
