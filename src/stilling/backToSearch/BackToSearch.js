import React from 'react';
import { Link } from 'react-router-dom';
import Chevron from 'nav-frontend-chevron';
import './BackToSearch.less';

function BackToSearchLink() {
    return (
        <Link
            to="/"
            className="BackToSearchLink knapp knapp--flat no-print"
        >
            <Chevron type="venstre" className="BackToSearchLink__chevron" />
            <span className="BackToSearchLink__text">
                Til stillingssøk
            </span>
        </Link>
    );
}

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
        return (rect.top <= windowHeight) && ((rect.top) >= 0);
    };

    render() {
        return (
            <div className="BackToSearch">
                <div
                    ref={(inlineBackButton) => {
                        this.inlineBackButton = inlineBackButton;
                    }}
                    className="BackToSearch__inline"
                >
                    <BackToSearchLink />
                </div>
                {this.state.showStickyBackButton && (
                    <div className="BackToSearch__sticky">
                        <div className="container">
                            <BackToSearchLink />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

