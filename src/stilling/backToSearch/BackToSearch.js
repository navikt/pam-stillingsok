import React from 'react';
import { Link } from 'react-router-dom';
import Chevron from 'nav-frontend-chevron';
import './BackToSearch.less';
import SnapToTop from '../../common/SnapToTop';

export default function BackToSearch() {
    return (
        <SnapToTop inlineClassName="BackToSearch__inline" stickyClassName="BackToSearch__sticky">
            <Link
                to="/"
                className="BackToSearchLink knapp knapp--flat no-print"
            >
                <Chevron type="venstre" className="BackToSearchLink__chevron" />
                <span className="BackToSearchLink__text">
                    Til stillingssøk
                </span>
            </Link>
        </SnapToTop>
    );
}
