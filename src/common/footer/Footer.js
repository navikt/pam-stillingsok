import { Column, Container, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import './Footer.less';

const Footer = () => (
    <div className="Footer">
        <Container>
            <Row>
                <Column xs="12" md="1" />
                <Column xs="12" md="11">
                    <Normaltekst className="Footer__slogan">Alt av arbeid på ett sted</Normaltekst>
                </Column>
            </Row>
            <Row>
                <Column xs="12" md="1" />
                <Column xs="12" md="11">
                    <a className="Footer__logo lenke" href="https://www.nav.no/Forsiden" title="Gå til nav.no">
                        <i className="Footer__logo__nav-icon" aria-label="NAV logo" />
                    </a>
                </Column>
            </Row>
        </Container>
    </div>
);

export default Footer;
