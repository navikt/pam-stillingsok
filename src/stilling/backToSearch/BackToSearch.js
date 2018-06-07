import React from 'react';
import { Link } from 'react-router-dom';
import Chevron from 'nav-frontend-chevron';
import './BackToSearch.less';

export default class BackToSearch extends React.Component {
    render() {
        return (
            <div className="BackToSearch">
                <Link
                    to="/"
                    className="knapp knapp--green knapp--standard"
                >
                    <Chevron type="venstre" className="BackToSearch__chevron" />
                Tilbake til søk
                </Link>
            </div>
        );
    }
}
