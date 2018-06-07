/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Column } from 'nav-frontend-grid';
import ReactHtmlParser from 'react-html-parser';
import { Panel } from 'nav-frontend-paneler';
import { Sidetittel } from 'nav-frontend-typografi';
import StillingsBoks from './listbox/ListBox';
import Details from './Details';
import NotFound from './NotFound';
import SearchError from '../search/error/SearchError';
import Expired from './Expired';
import BackToSearch from './backToSearch/BackToSearch';
import './Stilling.less';
import {
    FETCH_STILLING_BEGIN
} from './stillingReducer';

const arrayHasData = (array) => array && array[0].hasOwnProperty('punkt');

class Stilling extends React.Component {
    componentDidMount() {
        this.props.getStilling(this.props.match.params.uuid);
    }

    render() {
        const { stilling, error } = this.props;
        return (
            <div>
                <div className="background--light-green">
                    <Container>
                        <BackToSearch />
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

                {stilling && stilling._source.status !== 'ACTIVE' && (
                    <Container>
                        <Expired />
                    </Container>
                )}

                {stilling && stilling._source.status === 'ACTIVE' && (
                    <article id="annonse-container">
                        <header id="annonse-header" className="background--light-green">
                            <Container>
                                <Row className="blokk-m">
                                    <Column xs="12" md="8">
                                        <Sidetittel id="stillingstittel">
                                            {stilling._source.title}
                                        </Sidetittel>
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
                                    <section aria-labelledby="tilleggsinformasjon-title">
                                        <Details stilling={stilling} />
                                    </section>
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
    stilling: undefined
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
    getStilling: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    stilling: state.stilling.stilling,
    error: state.stilling.error
});

const mapDispatchToProps = (dispatch) => ({
    getStilling: (uuid) => dispatch({ type: FETCH_STILLING_BEGIN, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(Stilling);
