import React from 'react';
import { Link } from 'react-router-dom';
import Chevron from 'nav-frontend-chevron';
import './BackToSearch.less';

export default function BackToSearch() {
    return (
        <div className="BackToSearch">
            <Link
                to="/"
                className="lenke BackToSearch__lenke"
            >
                <Chevron stor type="venstre" className="BackToSearch__chevron"/>
                <span className="BackToSearch__text">Tilbake til søk</span>
            </Link>
        </div>
    );
}
