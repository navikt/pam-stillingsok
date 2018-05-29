import React from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';


export default function StillingsBoks(props) {

    return (
        <Row id="stillingsboks" className="blokk-s" >
            <Column xs="3" id="left-panel">
                <Element> {props.title} </Element>
            </Column>
            <Column xs="9" id="right-panel" >
                <ul className="dashed">
                    {props.items.map((item, i) =>
                        <li key={i}>{item.punkt}</li>
                    )}
                </ul>
            </Column>
        </Row>
    );
}


StillingsBoks.propTypes = {
    items: PropTypes.array.isRequired
};