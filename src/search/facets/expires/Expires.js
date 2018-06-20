import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { SEARCH } from '../../searchReducer';
import {
    CHECK_EXPIRES,
    UNCHECK_EXPIRES
} from './expiresReducer';
import './Expires.less';

class Expires extends React.Component {
    onExpiresClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkExpires(value);
        } else {
            this.props.uncheckExpires(value);
        }
        this.props.search();
    };

    render() {
        const { expires, checkedExpires } = this.props;
        let title = 'Søknadsfrist';
        if (checkedExpires.length === 1) {
            title += ' (1 valgt)';
        } else if (checkedExpires.length > 1) {
            title += ` (${checkedExpires.length} valgte)`;
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
                tittelProps="element"
                className="Expires"
                apen
            >
                <div
                    role="group"
                    aria-label="Expires"
                    className="Expires__inner"
                >
                    {expires && expires.map((item) => (
                        <Checkbox
                            name="expires"
                            key={item.key}
                            label={`${item.key} (${item.count})`}
                            value={item.key}
                            onChange={this.onExpiresClick}
                            checked={checkedExpires.includes(item.key)}
                        />
                    ))}
                </div>
            </Ekspanderbartpanel>
        );
    }
}

Expires.propTypes = {
    expires: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number
    })).isRequired,
    checkedExpires: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkExpires: PropTypes.func.isRequired,
    uncheckExpires: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    expires: state.expires.expires,
    checkedExpires: state.expires.checkedExpires
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkExpires: (value) => dispatch({ type: CHECK_EXPIRES, value }),
    uncheckExpires: (value) => dispatch({ type: UNCHECK_EXPIRES, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Expires);
