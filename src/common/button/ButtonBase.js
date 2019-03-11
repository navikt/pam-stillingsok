import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Button.less';

export default function Button(props) {
    const {
        children, onClick, className, type, htmlType, mini, disabled, spinner, ...rest
    } = props;
    const spinnerNode = spinner ? <span className="Button__spinner" /> : null;
    const ariaLabel = spinner ? { 'aria-label': 'Laster' } : {};
    return (
        <button
            disabled={disabled}
            type={htmlType}
            className={classNames('Button', 'typo-normal', className, {
                'Button--primary': type === 'primary',
                'Button--flat': type === 'flat',
                'Button--mini': mini,
                'Button--disabled': disabled
            })}
            onClick={onClick}
            {...ariaLabel}
            {...rest}
        >
            {children}
            {spinnerNode}
        </button>
    );
}

Button.defaultProps = {
    onClick: undefined,
    className: '',
    htmlType: 'submit',
    mini: false,
    disabled: false,
    spinner: false,
    type: 'secondary'
};

Button.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node, PropTypes.string
    ]).isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    htmlType: PropTypes.oneOf(['submit', 'button', 'reset']),
    type: PropTypes.oneOf(['primary', 'flat', 'secondary']),
    mini: PropTypes.bool,
    disabled: PropTypes.bool,
    spinner: PropTypes.bool
};
