import React from "react";
import PropTypes from "prop-types";
import "./SnapToTop.less";

export default class SnapToTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showStickyElement: undefined
        };
    }

    componentDidMount() {
        this.onWindowScroll();
        window.addEventListener("scroll", this.onWindowScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onWindowScroll);
    }

    onWindowScroll = () => {
        if (!this.inlineEl) {
            return;
        }

        const shouldShowStickyElement = !this.isInlineElementVisible();

        if (shouldShowStickyElement && !this.state.showStickyElement) {
            this.setState({
                showStickyElement: true
            });
        } else if (!shouldShowStickyElement && this.state.showStickyElement) {
            this.setState({
                showStickyElement: false
            });
        }
    };

    isInlineElementVisible = () => {
        const rect = this.inlineEl.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight && rect.top >= 0;
    };

    render() {
        const { className } = this.props;
        return (
            <div className={className ? `SnapToTop ${className}` : "SnapToTop"}>
                <div
                    ref={(inlineEl) => {
                        this.inlineEl = inlineEl;
                    }}
                    className={`SnapToTop__inline ${this.props.inlineClassName}`}
                >
                    {this.props.children}
                </div>
                {this.state.showStickyElement && (
                    <div className={`SnapToTop__sticky ${this.props.stickyClassName}`}>{this.props.children}</div>
                )}
            </div>
        );
    }
}

SnapToTop.defaultProps = {
    inlineClassName: undefined,
    stickyClassName: undefined,
    className: undefined
};

SnapToTop.propTypes = {
    className: PropTypes.string,
    inlineClassName: PropTypes.string,
    stickyClassName: PropTypes.string,
    children: PropTypes.node.isRequired
};
