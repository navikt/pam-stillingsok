import React from 'react';
import PropTypes from 'prop-types';
import './ListBox.less';

export default function ListBox(props) {
    return (
        <div className="ListBox" >
            <div className="ListBox__title">
                <h2 className="ListBox__title__h2">{props.title}</h2>
            </div>
            <div className="ListBox__content">
                <ul className="ListBox__content__ul">
                    {props.items.map((item, i) =>
                        <li key={i} className="typo-normal">{item.punkt}</li>)}
                </ul>
            </div>
        </div>
    );
}


ListBox.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        punkt: PropTypes.string
    })).isRequired
};
