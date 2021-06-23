import * as React from "react";
import './Infobox.less';

const InfoBox = ({color, title, marginTop}) => {
    return (
        <div className={'Infobox__' + color + ' Infobox'} style={{marginTop: marginTop}}>
            <div className="Infobox__circle" aria-label="Viktig"/>
            <h2>{title}</h2>
        </div>
    )
};

export default InfoBox;
