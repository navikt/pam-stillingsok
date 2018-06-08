import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Column } from 'nav-frontend-grid';
import { Sidetittel, Normaltekst } from 'nav-frontend-typografi';
import SearchResults from './searchResults/SearchResults';
import SearchError from './error/SearchError';
import Sorting from './sorting/Sorting';
import Counties from './facets/counties/Counties';
import HeltidDeltid from './facets/extent/Extent';
import EngagementType from './facets/engagement/Engagement';
import Sector from './facets/sector/Sector';
import Created from './facets/created/Created';
import SearchBox from './searchBox/SearchBox';
import { INITIAL_SEARCH, KEEP_SCROLL_POSITION } from './searchReducer';
import BackToTop from './backToTopButton/BackToTop';
import Disclaimer from '../discalimer/Disclaimer';
import './Search.less';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.props.initialSearch();
    }

    componentDidMount() {
        const top = this.props.scrollPosition;
        setTimeout(() => {
            window.scrollTo(0, top);
        }, 10);
    }

    componentWillUnmount() {
        const top = window.pageYOffset || document.documentElement.scrollTop;
        this.props.keepScrollPosition(top);
    }

    render() {
        return (
            <div className="Search">
                <Disclaimer />
                <div className="Search__header">
                    <Container>
                        <Row>
                            <Column xs="12">
                                <Sidetittel className="Search__header__title">Ledige stillinger</Sidetittel>
                                <Normaltekst>
                                    Her finner du offentlig utlyste stillinger i Norge.
                                </Normaltekst>
                            </Column>
                        </Row>
                    </Container>
                </div>
                <Container className="Search__main">
                    {this.props.hasError ? (
                        <SearchError />
                    ) : (
                        <Row>
                            <Column xs="12" md="4">
                                <form role="search" id="SearchForm">
                                    <SearchBox />
                                    <a href="#sokeresultat" className="typo-normal lenke sr-only sr-only-focusable">
                                        Hopp til søkeresultat
                                    </a>
                                    <Created />
                                    <Counties />
                                    <HeltidDeltid />
                                    <EngagementType />
                                    <Sector />
                                </form>
                            </Column>
                            <Column xs="12" md="5" />
                            <Column xs="12" md="3">
                                <Sorting />
                            </Column>
                            <Column xs="12" md="8">
                                <div
                                    id="sokeresultat"
                                >
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
    initialSearch: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
    scrollPosition: PropTypes.number,
    keepScrollPosition: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    hasError: state.search.hasError,
    scrollPosition: state.search.scrollPosition
});

const mapDispatchToProps = (dispatch) => ({
    initialSearch: () => dispatch({ type: INITIAL_SEARCH }),
    keepScrollPosition: (scrollPosition) => dispatch({ type: KEEP_SCROLL_POSITION, scrollPosition })
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
