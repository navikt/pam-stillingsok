import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Radio } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { SEARCH } from '../../searchReducer';
import {
    CHECK_EXPIRES,
    UNCHECK_EXPIRES
} from './expiresReducer';
import './Expires.less';

class Expires extends React.Component {
    onExpiresClick = (e) => {
        if (this.props.checkedExpires.length !== 0) {
            this.props.uncheckExpires(this.props.checkedExpires[0]);
        }
        const { value } = e.target;
        if (value !== '0') {
            this.props.checkExpires(value);
        }
        this.props.search();
    };

    render() {
        const { expires, checkedExpires } = this.props;
        let title = 'Søknadsfrist';
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
                    {(
                        <Radio
                            name="expires"
                            label="Ingen"
                            value='0'
                            onChange={this.onExpiresClick}
                            defaultChecked={true}
                        />
                    )}
                    {expires && expires.map((item) => (
                        <Radio
                            name="expires"
                            key={item.key}
                            label={`${item.key === 'now/d+1d' ? 'I dag' : item.key === 'now/d+3d' ? 'Neste 3 dager' : item.key === 'now/d+1w' ? 'Neste uke' : item.key === 'now/d+2w' ? 'Neste 14 dager' : 'Neste måned'} (${item.count})`}
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
