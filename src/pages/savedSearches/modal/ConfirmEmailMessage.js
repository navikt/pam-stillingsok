import React, { useEffect, useRef } from "react";

function ConfirmEmailMessage({ onClose }) {
    const buttonRef = useRef(null);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    }, []);

    return (
        <section role="status">
            <p className="SavedSearches__p">
                Du må bekrefte e-postadressen din. Klikk på lenken i e-posten du har mottatt.
            </p>

            <div className="SaveSearchForm__buttons">
                <button className="Button Button--primary" ref={buttonRef} onClick={onClose}>
                    Lukk
                </button>
            </div>
        </section>
    );
}

ConfirmEmailMessage.propTypes = {};

export default ConfirmEmailMessage;
