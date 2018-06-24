import React from 'react';

export default class RestoreScroll extends React.Component {
    componentDidMount() {
        try {
            const top = sessionStorage.getItem('top');
            setTimeout(() => {
                window.scrollTo(0, top);
            }, 10);
        } catch (error) {
            // ignore error
        }
    }

    componentWillUnmount() {
        const top = window.pageYOffset || document.documentElement.scrollTop;
        try {
            sessionStorage.setItem('top', top);
        } catch (error) {
            // ignore error
        }
    }

    render() {
        return this.props.children;
    }
}

