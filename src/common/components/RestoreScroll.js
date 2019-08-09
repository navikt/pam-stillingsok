import React from 'react';
import PropTypes from 'prop-types';
import debounce from '../utils/debounce';

export default class RestoreScroll extends React.Component {
    constructor(props) {
        super(props);
        this.sessionStorageId = `scrollTop-${props.id}`;
        this.debounced = debounce(this.keepScrollPosition, 100);
    }

    componentDidMount() {
        this.restoreScrollPosition();
        window.addEventListener('scroll', this.debounced);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.debounced);
        this.debounced = null;
    }

    keepScrollPosition = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        try {
            sessionStorage.setItem(this.sessionStorageId, `${scrollTop}`);
        } catch (error) {
            // Ignore any session storage error
        }
    };

    restoreScrollPosition = () => {
        try {
            const scrollTop = sessionStorage.getItem(this.sessionStorageId);
            if (scrollTop && scrollTop !== null) {
                sessionStorage.removeItem(this.sessionStorageId);
                requestAnimationFrame(() => {
                    window.scrollTo(0, parseInt(scrollTop, 10));
                });
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
    id: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
