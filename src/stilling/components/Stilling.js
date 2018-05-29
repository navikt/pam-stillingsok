import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Column } from 'nav-frontend-grid';
import { Panel } from 'nav-frontend-paneler';
import { Sidetittel } from 'nav-frontend-typografi';
import StillingsBoks from './StillingsBoks';
import Details from './Details';
import ReactHtmlParser from 'react-html-parser';


const arrayHasData = (array) => array && array[0].hasOwnProperty('punkt');

export default function Stilling({ stilling }) {
    const { properties } = stilling._source;
    return (
        <article id="annonse-container">
            <header id="annonse-header" className="background--light-green">
                <Container>
                    <Row className="blokk-m">
                        <Column xs="12" md="8">
                            <Sidetittel id="stillingstittel">{stilling._source.title}</Sidetittel>
                        </Column>
                    </Row>
                </Container>
            </header>
            <Container className="annonse-margin">
                <Row>
                    <Column xs="12" md="8">
                        <section>
                            <Panel className="blokk-s panel--padding panel--gray-border">
                                {properties.adtext && (
                                    <Row>
                                        <Column xs="12">
                                            <div id="stillingstekst" className="blokk-s">{ ReactHtmlParser(properties.adtext) }</div>
                                        </Column>
                                    </Row>
                                )}
                            </Panel>
                            {arrayHasData(properties.hardrequirements) && (
                                <StillingsBoks title="Krav (kvalifikasjoner)" items={properties.hardrequirements} />
                            )}
                            {arrayHasData(properties.softrequirements) && (
                                <StillingsBoks title="Ønsket kompetanse" items={properties.softrequirements} />
                            )}
                            {arrayHasData(properties.personalattributes) && (
                                <StillingsBoks title="Personlige egenskaper" items={properties.personalattributes} />
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
    );
}

Stilling.propTypes = {
    stilling: PropTypes.shape({
        arbeidsgiver: PropTypes.string,
        tittel: PropTypes.string,
        stillingUrl: PropTypes.string,
        registreringsdato: PropTypes.string,
        soknadsfrist: PropTypes.string,
        sted: PropTypes.string
    }).isRequired
};
