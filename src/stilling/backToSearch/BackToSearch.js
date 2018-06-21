import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Chevron from 'nav-frontend-chevron';
import './BackToSearch.less';

function BackToSearchLink({ urlQuery }) {
    return (
        <Link
            to={`/${urlQuery}`}
            className="lenke BackToSearch__lenke typo-normal"
        >
            <Chevron stor type="venstre" className="BackToSearch__chevron" />
            <span className="BackToSearch__text">Tilbake til søk</span>
        </Link>
    );
}

BackToSearchLink.defaultProps = {
    urlQuery: undefined
};

BackToSearchLink.propTypes = {
    urlQuery: PropTypes.string
};

export default class BackToSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showStickyBackButton: false
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onWindowScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onWindowScroll);
    }

    onWindowScroll = () => {
        if (!this.inlineBackButton) {
            return;
        }

        const shouldShowStickyBackButton = !this.isInlineBackButtonVisible();

        if (shouldShowStickyBackButton && !this.state.showStickyBackButton) {
            this.setState({
                showStickyBackButton: true
            });
        } else if (!shouldShowStickyBackButton && this.state.showStickyBackButton) {
            this.setState({
                showStickyBackButton: false
            });
        }
    };

    isInlineBackButtonVisible = () => {
        const rect = this.inlineBackButton.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        return (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    };

    render() {
        return this.props.urlQuery ? (
            <div>
                <div ref={(inlineBackButton) => { this.inlineBackButton = inlineBackButton; }} className="BackToSearch">
                    <BackToSearchLink urlQuery={this.props.urlQuery} />
                </div>
                {this.state.showStickyBackButton && (
                    <div className="BackToSearch BackToSearch--sticky">
                        <div className="container">
                            <BackToSearchLink urlQuery={this.props.urlQuery} />
                        </div>
                    </div>
                )}
            </div>
        ) : null;
    }
}

BackToSearch.defaultProps = {
    urlQuery: undefined
};

BackToSearch.propTypes = {
    urlQuery: PropTypes.string
};
