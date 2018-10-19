import PropTypes from 'prop-types';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { Link } from 'react-router-dom';
import { LOGIN_URL } from '../fasitProperties';
import './NotAuthenticated.less';

export default function NotAuthenticated({ title }) {
    return (
        <div className="NotAuthenticated">
            <Undertittel className="NotAuthenticated__title">{title}</Undertittel>
            <Normaltekst className="NotAuthenticated__message">
                Logg inn med BankID, BankID på mobil, Buypass eller Commfides.
            </Normaltekst>
            <Link to={`${LOGIN_URL}?redirect=${window.location.href}`} className="knapp knapp--hoved">Logg inn</Link>
        </div>
    );
}

NotAuthenticated.defaultProps = {
    title: 'Du er ikke innlogget'
};

NotAuthenticated.propTypes = {
    title: PropTypes.string
};
