import Chevron from 'nav-frontend-chevron';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from "react-router";
import { connect } from 'react-redux';
import { Lenkeknapp } from '@navikt/arbeidsplassen-knapper';
import './BackLink.less';
import { TopLevelPages } from './backLinkReducer';

function renderLabel(path) {
    if(path === TopLevelPages.FAVORITTER.url) {
        return "Til favoritter"
    }
    return "Ledige stillinger"
}

function BackLink({ backLinkUrl }) {
    const history = useHistory();

    const onBackLinkUrlClick = (e) => {
        e.preventDefault();
        history.push(backLinkUrl);
    }

    if(backLinkUrl.startsWith('/')) {
        return (
            <Lenkeknapp
                onClick={onBackLinkUrlClick}
                className="BackLink no-print"
            >
                <Chevron type="venstre" className="BackLink__chevron"/>
                <span className="BackLink__label">
                    {renderLabel(backLinkUrl)}
                </span>
            </Lenkeknapp>
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
