import React from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';

export default function ListBox(props) {

    return (
        <Row id="stillingsboks" className="blokk-s" >
            <Column xs="4" id="left-panel">
                <Element>{props.title}</Element>
            </Column>
            <Column xs="8" id="right-panel" >
                <ul className="dashed">
                    {props.items.map((item, i) =>
                        <li key={i} className="typo-normal">{item.punkt}</li>
                    )}
                </ul>
            </Column>
        </Row>
    );
}


ListBox.propTypes = {
    items: PropTypes.array.isRequired
};