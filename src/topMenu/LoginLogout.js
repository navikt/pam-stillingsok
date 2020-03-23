import React, { useContext, useState } from 'react';

export default function LoginLogout() {
    const [showPopover, setShowPopover] = useState(false);

    return (
        <div className="LoginLogout">
                <button
                    type="button"
                    className="LoginLogout__toggleBtn Knapp Knapp--mini"
                    aria-haspopup="true"
                    aria-expanded="false"
                    onClick={() => {
                        setShowPopover(!showPopover);
                    }}
                >
                    Logg inn
                </button>

                {showPopover && (
                    <div className="LoginLogout__popover">
                        <a
                            href="/logg-inn-jobbsoker"
                            className="LoginLogout__popover__link"
                            aria-label="Logg inn som jobbsøker"
                        >
                            For jobbsøkere
                        </a>
                        <a
                            href="/logg-inn-arbeidsgiver"
                            className="LoginLogout__popover__link"
                            aria-label="Logg inn som arbeidsgiver"
                        >
                            For arbeidsgivere
                        </a>
                    </div>
                )}
        </div>
    );
}
