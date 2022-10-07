import React from 'react';
import PropTypes from 'prop-types';
import './TextField.less';

function TextField({id, label, value, type, onChange, error, autoComplete}) {
    return (
        <div className="TextField">
            <label className="TextField__label" htmlFor={id}>
                {label}
            </label>
            <input
                className={error ? "TextField__input TextField__input--error" : "TextField__input"}
                id={id}
                onChange={onChange}
                value={value}
                type={type}
                autoComplete={autoComplete}
                aria-invalid={error}
                aria-describedby={error ? `${id}-error` : undefined}
            />
            {error && (
                <p id={`${id}-error`} aria-live="polite" className="TextField__error">
                    {error}
                </p>
            )}
        </div>
    );
}

TextField.defaultProps = {
    error: undefined,
    type: "text",
    autoComplete: undefined
}

TextField.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.string,
    autoComplete: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string
}

export default TextField;
