import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Chevron from 'nav-frontend-chevron';
import { toUrlQuery } from '../../search/searchReducer';
import { toUrl } from '../../search/url';
import './BackToSearch.less';

function BackToSearchLink({ urlQuery }) {
    return (
        <Link
            to={`/${urlQuery}`}
            className="BackToSearchLink knapp knapp--flat no-print"
        >
            <Chevron type="venstre" className="BackToSearchLink__chevron" />
            <span className="BackToSearchLink__text">
                {urlQuery === '' ? 'Gå til søk' : 'Tilbake'}
            </span>
        </Link>
    );
}

BackToSearchLink.defaultProps = {
    urlQuery: undefined
};

BackToSearchLink.propTypes = {
    urlQuery: PropTypes.string
};

class BackToSearch extends React.Component {
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
                    <BackToSearchLink urlQuery={this.props.urlQuery} />
                </div>
                {this.state.showStickyBackButton && (
                    <div className="BackToSearch__sticky">
                        <div className="container">
                            <BackToSearchLink urlQuery={this.props.urlQuery} />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

BackToSearch.defaultProps = {
    urlQuery: ''
};

BackToSearch.propTypes = {
    urlQuery: PropTypes.string
};

const mapStateToProps = (state) => ({
    urlQuery: toUrl(toUrlQuery(state))
});


export default connect(mapStateToProps)(BackToSearch);
