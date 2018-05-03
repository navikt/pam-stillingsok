import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Sørger for at children som ikke får routing(Link) kan få det likevel
 */
class RouterForwarder extends Component {
    getChildContext() {
        return this.props.context;
    }

    render() {
        return <span>{this.props.children}</span>;
    }
}

RouterForwarder.childContextTypes = {
    router: PropTypes.object.isRequired
};

RouterForwarder.propTypes = {
    context: PropTypes.shape({
        router: PropTypes.object
    }).isRequired,
    children: PropTypes.element.isRequired
};

export default RouterForwarder;
