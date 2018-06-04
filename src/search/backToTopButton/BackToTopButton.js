import React from 'react';
import PropTypes from 'prop-types';
import './BackToTopButton.less';

export default class BackToTopButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: window.scrollY > props.offset
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onWindowScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onWindowScroll);
    }

    onWindowScroll = () => {
        const top = window.scrollY;
        if (top >= this.props.offset && !this.state.show) {
            this.setState({
                show: true
            });
        } else if (top < this.props.offset && this.state.show) {
            this.setState({
                show: false
            });
        }
    };

    render() {
        return (
            <a
                href="#topbar"
                className={this.state.show ? 'BackToTopButton' : 'BackToTopButton BackToTopButton--hidden'}
            >
                <span className="BackToTopButton__text">Tilbake til toppen</span>
                <span className="BackToTopButton__arrow" aria-label="Tilbake til toppen">&uarr;</span>
            </a>
        );
    }
}

BackToTopButton.defaultProps = {
    offset: 300
};

BackToTopButton.propTypes = {
    offset: PropTypes.number
};

