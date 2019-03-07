import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Lenkeknapp.less';

export default function Lenkeknapp({
    children, onClick, className, ariaLabel
}) {
    return (
        <button
            className={classNames(
                'Lenkeknapp',
                'typo-normal',
                className
            )}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
}

Lenkeknapp.defaultProps = {
    onClick: undefined,
    ariaLabel: undefined,
    className: ''
};

Lenkeknapp.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.node, PropTypes.string
    ]).isRequired,
    className: PropTypes.string,
    ariaLabel: PropTypes.string
};

