import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TilToppenButton from './TilToppenButton';
import VisTreffButton from './VisTreffButton';

import './BackToTop.less';

class BackToTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showGoToSearch: false,
            showGoToResults: true
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onWindowScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onWindowScroll);
    }

    onWindowScroll = () => {
        if (this.isSearchResultsVisible() && this.isSearchFormVisible()) {
            this.setState({
                showGoToSearch: false,
                showGoToResults: false
            });
        } else if (this.isSearchFormVisible()) {
            this.setState({
                showGoToSearch: false,
                showGoToResults: true
            });
        } else if (this.isSearchResultsVisible()) {
            this.setState({
                showGoToSearch: true,
                showGoToResults: false
            });
        }
    };

    isSearchFormVisible = () => {
        if (this.searchForm === undefined) {
            this.searchForm = document.getElementById('sok');
        }
        return this.isElementVisible(this.searchForm);
    };

    isSearchResultsVisible = () => {
        if (this.el === undefined) {
            this.el = document.getElementById('treff');
        }
        return this.isElementVisible(this.el);
    };

    isElementVisible = (el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        return (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    };

    render() {
        if (this.props.searchResults && this.state.showGoToResults) {
            return (
                <VisTreffButton count={this.props.searchResults.total} />
            );
        } else if (this.props.searchResults && this.state.showGoToSearch) {
            return (
                <TilToppenButton />
            );
        }
        return null;
    }
}

BackToTop.defaultProps = {
    searchResults: undefined
};

BackToTop.propTypes = {
    searchResults: PropTypes.shape({
        total: PropTypes.number
    })
};

const mapStateToProps = (state) => ({
    searchResults: state.search.searchResult
});


export default connect(mapStateToProps)(BackToTop);

