import React from 'react';
import Chevron from 'nav-frontend-chevron';
import './BackToSearch.less';

export default function BackToSearch({onClick}) {
    return (
        <div className="BackToSearch">
            <a
                onClick={onClick}
                className="lenke BackToSearch__lenke"
            >
                <Chevron stor type="venstre" className="BackToSearch__chevron"/>
                <span className="BackToSearch__text">Tilbake til søk</span>
            </a>
        </div>
    );
}
