import React from 'react';
import { Link } from 'react-router-dom';
import Chevron from 'nav-frontend-chevron';
import './BackToSearch.less';

export default function BackToSearch({urlQuery}) {

    return urlQuery ? (
        <div className="BackToSearch">
            <Link
                to={`/${urlQuery}`}
                className="lenke BackToSearch__lenke"
            >
                <Chevron stor type="venstre" className="BackToSearch__chevron"/>
                <span className="BackToSearch__text">Tilbake til søk</span>
            </Link>
        </div>
    ) : null;
}
