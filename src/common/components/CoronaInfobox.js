import * as React from "react";
import './CoronaInfobox.less';

const CoronaInfobox = ({color, title, children}) => {
    return (
        <div className={'CoronaInfobox__' + color + ' CoronaInfobox'}>
            <div className="CoronaInfobox__header">
                <div className="CoronaInfobox__circle" aria-label="Viktig"/>
                <h2>{title}</h2>
            </div>
            <section>
                {children}
            </section>
        </div>
    )
};

export default CoronaInfobox;
