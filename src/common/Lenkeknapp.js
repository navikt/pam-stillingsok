import React from 'react';
import PropTypes from 'prop-types';
import './Lenkeknapp.less';
import classNames from 'classnames';

export default function Lenkeknapp({ children, onClick, className }) {
    return (
        <button
            className={classNames('Lenkeknapp',
                'typo-normal',
                className)}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

Lenkeknapp.defaultProps = {
    onClick: undefined,
    className: ''
};

Lenkeknapp.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.node, PropTypes.string
    ]).isRequired,
    className: PropTypes.string
};

