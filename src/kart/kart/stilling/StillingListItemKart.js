import React from 'react';
import PropTypes from 'prop-types';
import { Element, Undertekst } from 'nav-frontend-typografi';
import Lukknapp from 'nav-frontend-lukknapp';
import { Column, Row } from 'nav-frontend-grid';

export default function StillingListItemKart(props) {
    const s = props.stilling;
    return (
        <div>
            <Row>
                <Column xs="10">
                    <Element className="arbeidsgiver-overskrift">{s.arbeidsgiver}</Element>
                </Column>
                <Column xs="2" className="text-right">
                    <Lukknapp onClick={props.closePopup} />
                </Column>
            </Row>
            <a
                className="nav-frontend-lenker lenke typo-element"
                href={`/sok/stilling${s.stillingUrl}`}
                key={s.stillingUrl}
                title="Vis stilling"
                style={{ color: '#0067C5' }} // Må override leaflet js default

            >
                {s.tittel}
            </a>
            <div className="mt-1 mb-1">
                {s.registreringsdato ? (
                    <Undertekst>Registrert: {s.registreringsdato}</Undertekst>
                ) : null}
                {s.soknadsfrist ? (
                    <Undertekst>Frist: {s.soknadsfrist}</Undertekst>
                ) : null}
                {s.sted ? <Undertekst>{s.sted}</Undertekst> : null}
            </div>
        </div>
    );
}

StillingListItemKart.defaultProps = {
    stilling: {
        arbeidsgiver: '',
        tittel: '',
        soknadsfrist: '',
        sted: ''
    },
    search: ''
};

StillingListItemKart.propTypes = {
    stilling: PropTypes.shape({
        arbeidsgiver: PropTypes.string,
        tittel: PropTypes.string,
        soknadsfrist: PropTypes.string,
        sted: PropTypes.string
    }).isRequired,
    closePopup: PropTypes.func.isRequired
};
