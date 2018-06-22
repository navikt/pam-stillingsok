import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Column } from 'nav-frontend-grid';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import Loading from './Loading';

export default function Skeleton({ title, subtitle }) {
    return (
        <article className="Stilling">
            <header className="Stilling__header">
                <Container>
                    <Row>
                        <Column xs="12" md="8">
                            <div className="Stilling__title">
                                <Normaltekst>
                                    {subtitle}
                                </Normaltekst>
                                <Innholdstittel>
                                    {title}
                                </Innholdstittel>
                            </div>
                        </Column>
                    </Row>
                </Container>
            </header>
            <Container className="Stilling__main">
                <Row>
                    <Column xs="12" md="8">
                        <Loading />
                    </Column>
                    <Column xs="12" md="4">
                        <Loading spinner={false} />
                    </Column>
                </Row>
            </Container>
        </article>
    );
}

Skeleton.defaultProps = {
    title: '',
    subtitle: ''
};

Skeleton.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string
};

