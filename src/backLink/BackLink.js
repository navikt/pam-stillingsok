import Chevron from 'nav-frontend-chevron';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from "react-router";
import { connect } from 'react-redux';
import { Lenkeknapp } from '@navikt/arbeidsplassen-knapper';
import './BackLink.less';
import { TopLevelPages } from './backLinkReducer';
import {Link} from "react-router-dom";

function renderLabel(path) {
    if(path === TopLevelPages.FAVORITTER.url) {
        return "Til favoritter"
    }
    return "Ledige stillinger"
}

function BackLink({ backLinkUrl }) {

    if(backLinkUrl.startsWith('/')) {
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
    return <div />;
}

BackLink.propTypes = {
    backLinkUrl: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    backLinkUrl: state.backLink.backLinkUrl
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BackLink);
