import PropTypes from 'prop-types';
import React, { useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TRACK_NAVIGATION } from './backLinkReducer';

const BackLinkManager = ({ children, location: { pathname }, trackNavigation }) => {
    useLayoutEffect(() => {
        trackNavigation(pathname);
    }, [pathname]);

    return children;
};

BackLinkManager.defaultProps = {
    location: {
        pathname: undefined
    }
};

BackLinkManager.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string
    }),
    trackNavigation: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    trackNavigation: (pathname) => dispatch({ type: TRACK_NAVIGATION, pathname })
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BackLinkManager));
