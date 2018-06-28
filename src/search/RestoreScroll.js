import React from 'react';
import PropTypes from 'prop-types';

export default class RestoreScroll extends React.Component {
    componentDidMount() {
        this.restoreScrollPosition();
    }

    componentWillUnmount() {
        this.keepScrollPosition();
    }

    keepScrollPosition = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        try {
            sessionStorage.setItem('scrollTop', `${scrollTop}`);
        } catch (error) {
            // Ignore any session storage error
        }
    };

    restoreScrollPosition = () => {
        try {
            const scrollTop = sessionStorage.getItem('scrollTop');
            if (scrollTop && scrollTop !== null) {
                sessionStorage.removeItem('scrollTop');
                setTimeout(() => {
                    window.scrollTo(0, parseInt(scrollTop, 10));
                }, 10);
            } else {
                window.scrollTo(0, 0);
            }
        } catch (error) {
            // Ignore any session storage error
        }
    };

    render() {
        return this.props.children;
    }
}

RestoreScroll.defaultProps = {
    children: undefined
};

RestoreScroll.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
