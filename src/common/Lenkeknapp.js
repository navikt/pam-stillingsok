import React from 'react';
import PropTypes from 'prop-types';
import './Lenkeknapp.less';

export default function Lenkeknapp({ children, onClick }) {
    return (
        <button className="Lenkeknapp lenke typo-normal" onClick={onClick}>
            {children}
        </button>
    );
}

Lenkeknapp.defaultProps = {
    onClick: undefined
};

Lenkeknapp.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.node, PropTypes.string
    ]).isRequired
};

