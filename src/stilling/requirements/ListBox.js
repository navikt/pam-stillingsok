import React from 'react';
import PropTypes from 'prop-types';
import { Column } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import './ListBox.less';

export default function ListBox(props) {
    return (
        <div className="ListBox" >
            <Column xs="4" className="ListBox__title">
                <Element>{props.title}</Element>
            </Column>
            <Column xs="8" className="ListBox__content" >
                <ul>
                    {props.items.map((item, i) =>
                        <li key={i} className="typo-normal">{item.punkt}</li>)}
                </ul>
            </Column>
        </div>
    );
}


ListBox.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        punkt: PropTypes.string
    })).isRequired
};
