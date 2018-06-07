import React from 'react';
import PropTypes from 'prop-types';
import Chevron from 'nav-frontend-chevron';
import './BackToTop.less';

export default class BackToTop extends React.Component {
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
        const top = window.pageYOffset;
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
            <div
                className={this.state.show ? 'BackToTop' : 'BackToTop BackToTop--hidden'}
            >
                <a
                    href="#topbar"
                    className="BackToTop__link knapp knapp--green knapp--standard"
                    aria-label="Tilbake til toppen"
                >
                    <Chevron type="opp" className="BackToTop__chevron" />
                    <span className="BackToTop__link__text">Tilbake til toppen</span>
                </a>
            </div>
        );
    }
}

BackToTop.defaultProps = {
    offset: 300
};

BackToTop.propTypes = {
    offset: PropTypes.number
};

