import Chevron from 'nav-frontend-chevron';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './BackLink.less';
import { CONTEXT_PATH } from '../fasitProperties';

function renderLabel(path) {
    if(path === `${CONTEXT_PATH}/favoritter`) {
        return "Til favoritter"
    }
    return "Ledige stillinger"
}

function BackLink({ backLinkUrl }) {
    return (
        <Link
            to={backLinkUrl}
            className="BackLink no-print"
        >
            <Chevron type="venstre" className="BackLink__chevron"/>
            <span className="BackLink__label">
                {renderLabel(backLinkUrl)}
            </span>
        </Link>
    );
}

BackLink.propTypes = {
    backLinkUrl: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    backLinkUrl: state.backLink.backLinkUrl
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BackLink);
