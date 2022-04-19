import React, { useState } from "react";
import ReactDOM from "react-dom";

export default function LoginButton({ redirectToLogin }) {
    const [showPopover, setShowPopover] = useState(false);

    return (
        <React.Fragment>
            <button
                type="button"
                className="Knapp Knapp--mini"
                aria-expanded={showPopover}
                aria-controls="ArbeidsplassenHeader__expand"
                onClick={() => {
                    setShowPopover(!showPopover);
                }}
            >
                Logg inn
            </button>

            {showPopover &&
                ReactDOM.createPortal(
                    <div className="ArbeidsplassenHeader__options-wrapper">
                        <div className="ArbeidsplassenHeader__options">
                            <button
                                className="ArbeidsplassenHeader__option"
                                onClick={() => redirectToLogin("personbruker")}
                            >
                                <div className="ArbeidsplassenHeader__login-as">Logg inn som jobbsøker</div>
                                <div className="ArbeidsplassenHeader__chevron" />
                            </button>
                            <button
                                className="ArbeidsplassenHeader__option"
                                onClick={() => redirectToLogin("arbeidsgiver")}
                            >
                                <div className="ArbeidsplassenHeader__login-as">Logg inn som arbeidsgiver</div>
                                <div className="ArbeidsplassenHeader__chevron" />
                            </button>
                        </div>
                    </div>,
                    document.getElementById("ArbeidsplassenHeader__expand")
                )}
        </React.Fragment>
    );
}
