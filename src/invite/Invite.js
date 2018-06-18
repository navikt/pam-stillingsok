import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Column } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './Invite.less';

export default function Invite() {
    return (
        <div className="Invite">
            <Container>
                <Row>
                    <Column xs="12">
                        <div className="panel">
                            <Element tag="h1">Tidlig versjon av nytt stillingssøk</Element>
                            <Normaltekst className="blokk-s">
                                Har du lyst til å prøve ut en tidlig versjon av det nye stillingssøket til NAV?
                                Gå til stillingssøket for å teste og gi oss tilbakemelding.
                            </Normaltekst>
                            <Normaltekst className="blokk-s">
                                <Link to="/" className="lenke">Ja, jeg vil teste nytt stillingssøk</Link>
                            </Normaltekst>
                            <Normaltekst>
                                <a href="https://m.nav.no/stillinger/" className="lenke">
                                    Nei takk, gå til dagens stillingssøk
                                </a>
                            </Normaltekst>
                        </div>
                    </Column>
                </Row>
            </Container>
        </div>
    );
}
