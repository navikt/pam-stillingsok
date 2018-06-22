import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Column } from 'nav-frontend-grid';
import { Innholdstittel } from 'nav-frontend-typografi';
import Loading from './Loading';

export default function Skeleton({ title }) {
    return (
        <article className="Stilling">
            <header className="Stilling__header">
                <Container>
                    <Row>
                        <Column xs="12" md="8">
                            <Innholdstittel className="Stilling__title">
                                {title}
                            </Innholdstittel>
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
    title: ''
};

Skeleton.propTypes = {
    title: PropTypes.string
};

