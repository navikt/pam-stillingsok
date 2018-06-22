/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Column } from 'nav-frontend-grid';
import ReactHtmlParser from 'react-html-parser';
import { Panel } from 'nav-frontend-paneler';
import { Innholdstittel } from 'nav-frontend-typografi';
import StillingsBoks from './listbox/ListBox';
import Details from './Details';
import NotFound from './NotFound';
import SearchError from '../search/error/SearchError';
import Expired from './Expired';
import BackToSearch from './backToSearch/BackToSearch';
import { RESTORE_STATE_FROM_URL, toUrlQuery } from '../search/searchReducer';
import Disclaimer from '../discalimer/Disclaimer';
import Loading from './loading/Loading';
import { toUrl } from '../search/url';
import {
    FETCH_STILLING_BEGIN
} from './stillingReducer';
import './Stilling.less';

const arrayHasData = (array) => array && array[0].hasOwnProperty('punkt');

class Stilling extends React.Component {
    constructor(props) {
        super(props);
        this.hasSetTitle = false;
        this.props.restoreStateFromUrl();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.getStilling(this.props.match.params.uuid);
    }

    componentDidUpdate() {
        if (!this.hasSetTitle
            && this.props.stilling
            && this.props.stilling._source
            && this.props.stilling._source.title) {
            document.title = this.props.stilling._source.title;
            this.hasSetTitle = true;
        }
    }
    render() {
        const {
            stilling, cachedStilling, isFetchingStilling, error, urlQuery
        } = this.props;
        return (
            <div>
                <Disclaimer />
                <div className="background--light-green">
                    <Container>
                        <BackToSearch urlQuery={urlQuery} />
                    </Container>
                </div>
                {error && error.statusCode === 404 ? (
                    <Container>
                        <NotFound />
                    </Container>
                ) : error && (
                    <Container>
                        <SearchError />
                    </Container>
                )}

                {isFetchingStilling && (
                    <article id="annonse-container">
                        <header id="annonse-header" className="background--light-green">
                            <Container>
                                <Row className="blokk-m">
                                    <Column xs="12" md="8">
                                        {cachedStilling && (
                                            <Innholdstittel id="stillingstittel">
                                                {cachedStilling.title}
                                            </Innholdstittel>
                                        )}
                                    </Column>
                                </Row>
                            </Container>
                        </header>
                        <Container className="annonse-margin">
                            <Row>
                                <Column xs="12" md="8">
                                    <Loading />
                                </Column>
                                <Column xs="12" md="4">
                                    <Loading spinner={false}/>
                                </Column>
                            </Row>
                        </Container>
                    </article>
                )}

                {!isFetchingStilling && stilling && (
                    <article id="annonse-container">
                        <header id="annonse-header" className="background--light-green">
                            <Container>
                                <Row className="blokk-m">
                                    <Column xs="12" md="8">
                                        {stilling._source.status !== 'ACTIVE' && (
                                            <div className="blokk-xs">
                                                <Expired />
                                            </div>
                                        )}
                                        <Innholdstittel id="stillingstittel">
                                            {stilling._source.title}
                                        </Innholdstittel>
                                    </Column>
                                </Row>
                            </Container>
                        </header>
                        <Container className="annonse-margin">
                            <Row>
                                <Column xs="12" md="8">
                                    <section>
                                        <Panel className="blokk-s panel--padding panel--gray-border">
                                            {stilling._source.properties.adtext && (
                                                <Row>
                                                    <Column xs="12">
                                                        <div
                                                            id="stillingstekst"
                                                            className="blokk-s"
                                                        >
                                                            {ReactHtmlParser(stilling._source.properties.adtext)}
                                                        </div>
                                                    </Column>
                                                </Row>
                                            )}
                                        </Panel>
                                        {arrayHasData(stilling._source.properties.hardrequirements) && (
                                            <StillingsBoks
                                                title="Krav (kvalifikasjoner)"
                                                items={stilling._source.properties.hardrequirements}
                                            />
                                        )}
                                        {arrayHasData(stilling._source.properties.softrequirements) && (
                                            <StillingsBoks
                                                title="Ønsket kompetanse"
                                                items={stilling._source.properties.softrequirements}
                                            />
                                        )}
                                        {arrayHasData(stilling._source.properties.personalattributes) && (
                                            <StillingsBoks
                                                title="Personlige egenskaper"
                                                items={stilling._source.properties.personalattributes}
                                            />
                                        )}
                                    </section>
                                </Column>
                                <Column xs="12" md="4">
                                    <Details stilling={stilling} />
                                </Column>
                            </Row>
                        </Container>
                    </article>
                )}
            </div>
        );
    }
}

Stilling.defaultProps = {
    stilling: undefined,
    cachedStilling: undefined,
    isFetchingStilling: false,
    urlQuery: ''
};

Stilling.propTypes = {
    stilling: PropTypes.shape({
        _source: PropTypes.shape({
            status: PropTypes.string,
            title: PropTypes.string,
            properties: PropTypes.shape({
                adtext: PropTypes.string
            })
        })
    }),
    cachedStilling: PropTypes.shape({
        title: PropTypes.string
    }),
    restoreStateFromUrl: PropTypes.func.isRequired,
    getStilling: PropTypes.func.isRequired,
    isFetchingStilling: PropTypes.bool,
    urlQuery: PropTypes.string
};

const mapStateToProps = (state) => ({
    isFetchingStilling: state.stilling.isFetchingStilling,
    stilling: state.stilling.stilling,
    cachedStilling: state.stilling.cachedStilling,
    error: state.stilling.error,
    urlQuery: toUrl(toUrlQuery(state))
});

const mapDispatchToProps = (dispatch) => ({
    restoreStateFromUrl: () => dispatch({ type: RESTORE_STATE_FROM_URL }),
    getStilling: (uuid) => dispatch({ type: FETCH_STILLING_BEGIN, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(Stilling);
