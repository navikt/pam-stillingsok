import React, { useState } from 'react';
import './LoginButton.less'

export default function LoginButton({ redirectToLogin }) {
    const [showPopover, setShowPopover] = useState(false);

    return (
        <div className="LoginButton">
            <button
                type="button"
                className="LoginButton__toggle Knapp Knapp--mini"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={() => {
                    setShowPopover(!showPopover);
                }}
            >
                Logg inn
            </button>

            {showPopover && (
                <div className="LoginButton__popover">
                    <button
                        className="LoginButton__popover__link"
                        aria-label="Logg inn som jobbsøker"
                        onClick={() => redirectToLogin('personbruker')}
                    >
                        For jobbsøkere
                    </button>
                    <button
                        className="LoginButton__popover__link"
                        aria-label="Logg inn som arbeidsgiver"
                        onClick={() => redirectToLogin('arbeidsgiver')}
                    >
                        For arbeidsgivere
                    </button>
                </div>
            )}
        </div>
    );
}
