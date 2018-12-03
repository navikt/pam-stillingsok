import PropTypes from 'prop-types';
import React from 'react';
import './ViewMode.less';

const createLines = (status, count) => {
    return Array(count)
        .fill(0)
        .map((_, i) => {
            const key = `kompakt-line-${i}`;
            return <div key={key} className={`kompakt-line kompakt-line__${status}`} />;
        });
};

const KompaktKnapp = (props) => {
    const { clickHandler, status } = props;
    const lines = createLines(status, 4);
    return (
        <button type="button" className={`kompakt-knapp kompakt-knapp__${status}`} onClick={clickHandler}>
            {lines}
        </button>
    );
};

KompaktKnapp.propTypes = {
    status: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired
};

export default KompaktKnapp;
