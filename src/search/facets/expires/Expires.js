import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Radio } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { SEARCH } from '../../searchReducer';
import { SET_EXPIRES } from './expiresReducer';
import './Expires.less';

class Expires extends React.Component {
    onExpiresClick = (e) => {
        const { value } = e.target;
        if (value === 'SHOW_ALL') {
            this.props.setExpires(undefined);
        } else {
            this.props.setExpires(value);
        }
        this.props.search();
    };

    toLabel = (key) => {
        switch (key) {
            case '1d':
                return 'I dag';
            case '3d':
                return 'Neste 3 dager';
            case '1w':
                return 'Neste uke';
            case '2w':
                return 'Neste 14 dager';
            default:
                return 'Neste måned';
        }
    };

    render() {
        const { expires, value } = this.props;
        let title = 'Søknadsfrist';
        if (value !== undefined) {
            title += ' (1 valgt)';
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
                        <Radio
                            name="expires"
                            key={item.key}
                            label={`${this.toLabel(item.key)} (${item.count})`}
                            value={item.key}
                            onChange={this.onExpiresClick}
                            checked={value === item.key}
                        />
                    ))}
                    <Radio
                        name="expires"
                        label="Vis alle"
                        value="SHOW_ALL"
                        onChange={this.onExpiresClick}
                        checked={value === undefined}
                    />
                </div>
            </Ekspanderbartpanel>
        );
    }
}

Expires.defaultProps = {
    value: undefined
};

Expires.propTypes = {
    expires: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number
    })).isRequired,
    value: PropTypes.string,
    setExpires: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    expires: state.expires.expires,
    value: state.expires.value
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setExpires: (value) => dispatch({ type: SET_EXPIRES, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Expires);
