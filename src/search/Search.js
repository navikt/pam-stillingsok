import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Column } from 'nav-frontend-grid';
import { Sidetittel } from 'nav-frontend-typografi';
import DelayedSpinner from './loading/DelayedSpinner';
import SearchResults from './searchResults/SearchResults';
import SearchError from './error/SearchError';
import Sorting from './sorting/Sorting';
import Counties from './facets/counties/Counties';
import HeltidDeltid from './facets/extent/Extent';
import EngagementType from './facets/engagement/Engagement';
import Sector from './facets/sector/Sector';
import Published from './facets/published/Published';
import SearchBox from './searchBox/SearchBox';
import { RESTORE_STATE_FROM_URL, INITIAL_SEARCH, KEEP_SCROLL_POSITION, SEARCH } from './searchReducer';
import BackToTop from './backToTopButton/BackToTop';
import Disclaimer from '../discalimer/Disclaimer';
import './Search.less';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.props.restoreStateFromUrl();
        this.props.initialSearch();
    }

    componentDidMount() {
        document.title = 'Ledige stillinger';
        const top = this.props.scrollPosition;
        setTimeout(() => {
            window.scrollTo(0, top);
        }, 10);
    }

    componentWillUnmount() {
        const top = window.pageYOffset || document.documentElement.scrollTop;
        this.props.keepScrollPosition(top);
    }

    onSearchFormSubmit = (e) => {
        e.preventDefault();
        this.props.search();
    };

    render() {
        return (
            <div className="Search">
                <Disclaimer />
                <div className="Search__header">
                    <Container>
                        <Row>
                            <Column xs="12">
                                <Sidetittel className="Search__header__title">Ledige stillinger</Sidetittel>
                            </Column>
                        </Row>
                    </Container>
                </div>
                <Container className="Search__main">

                    {this.props.hasError && (
                        <SearchError />
                    )}
                    {!this.props.initialSearchDone ? (
                        <div className="Search__spinner">
                            <DelayedSpinner />
                        </div>
                    ) : (
                        <Row>
                            <form role="search" action="/" onSubmit={this.onSearchFormSubmit} className="no-print">
                                <Column xs="12" md="4">
                                    <div id="sok">
                                        <div className="Search__searchbox-wrapper">
                                            <SearchBox />
                                            <a href="#treff" className="typo-normal lenke sr-only sr-only-focusable">
                                                Hopp til søkeresultat
                                            </a>
                                        </div>
                                        <Published />
                                        <Counties />
                                        <HeltidDeltid />
                                        <EngagementType />
                                        <Sector />
                                    </div>
                                </Column>
                                <Column xs="12" md="5" />
                                <Column xs="12" md="3">
                                    <Sorting />
                                </Column>
                            </form>
                            <Column xs="12" md="8">
                                <div id="sokeresultat">
                                    <SearchResults />
                                </div>
                            </Column>
                        </Row>
                    )}
                    <BackToTop offset={300} />
                </Container>
            </div>
        );
    }
}

Search.defaultProps = {
    scrollPosition: 0
};

Search.propTypes = {
    restoreStateFromUrl: PropTypes.func.isRequired,
    initialSearch: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
    scrollPosition: PropTypes.number,
    initialSearchDone: PropTypes.bool.isRequired,
    keepScrollPosition: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    hasError: state.search.hasError,
    initialSearchDone: state.search.initialSearchDone,
    scrollPosition: state.search.scrollPosition
});

const mapDispatchToProps = (dispatch) => ({
    restoreStateFromUrl: () => dispatch({ type: RESTORE_STATE_FROM_URL }),
    initialSearch: () => dispatch({ type: INITIAL_SEARCH }),
    search: () => dispatch({ type: SEARCH }),
    keepScrollPosition: (scrollPosition) => dispatch({ type: KEEP_SCROLL_POSITION, scrollPosition })
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
