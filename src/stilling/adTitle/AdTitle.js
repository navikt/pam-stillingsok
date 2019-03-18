import React from 'react';
import PropTypes from 'prop-types';
import './AdTitle.less';

export function commaSeparate(...strings) {
    const onlyStrings = strings.filter((string) => (
        typeof string === 'string'
    ));
    return onlyStrings.join(', ');
}

export default function AdTitle({ title, employer, location }) {
    return (
        <div className="StillingsTitle">
            <div className="StillingsTitle__employer-and-location">
                {commaSeparate(employer, location)}
            </div>
            <h1 className="StillingsTitle__title">
                {title}
            </h1>
        </div>
    );
}

AdTitle.defaultProps = {
    title: '',
    employer: '',
    location: ''
};

AdTitle.propTypes = {
    title: PropTypes.string,
    employer: PropTypes.string,
    location: PropTypes.string
};
