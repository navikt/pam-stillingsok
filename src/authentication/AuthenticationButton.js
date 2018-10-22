import { Container } from 'nav-frontend-grid';
import React from 'react';
import { LOGIN_URL, LOGOUT_URL } from '../fasitProperties';
import './AuthenticationButton.less';

export default function AuthenticationButton() {
    return (
        <div className="AuthenticationButton-wrapper no-print">
            <Container>
                <a className="AuthenticationButton typo-element" href={LOGOUT_URL}>
                    Logg ut
                </a>
                &nbsp;
                <a
                    className="AuthenticationButton typo-element"
                    href={`${LOGIN_URL}?redirect=${window.location.href}`}
                >
                    Logg inn
                </a>
            </Container>
        </div>
    );
}

