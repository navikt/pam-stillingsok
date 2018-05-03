import React from 'react';
import PropTypes from 'prop-types';
import StillingListItemKart from './StillingListItemKart';

export default function StillingListKart(props) {
    return (
        <div>
            {props.stillinger &&
                props.stillinger.map((s) => (
                    <StillingListItemKart key={s.stillingUrl} stilling={s} search={props.search} closePopup={props.closePopup} />
                ))}
        </div>
    );
}

StillingListKart.defaultProps = {
    stillinger: undefined,
    search: ''
};

StillingListKart.propTypes = {
    stillinger: PropTypes.arrayOf(PropTypes.object),
    search: PropTypes.string,
    closePopup: PropTypes.func.isRequired
};
