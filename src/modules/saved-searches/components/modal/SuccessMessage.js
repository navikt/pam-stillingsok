import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../../common/environment";

function SuccessMessage({ onClose }) {
    let buttonRef = useRef(null);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    }, []);

    return (
        <section role="status">
            <p className="SavedSearches__p">
                Søket ble lagret! Du finner alle dine søk på{" "}
                <Link to={`${CONTEXT_PATH}/lagrede-sok`}>Lagrede søk.</Link>
            </p>
            <div className="SaveSearchForm__buttons">
                <button className="Knapp Knapp--hoved" ref={buttonRef} onClick={onClose}>
                    Lukk
                </button>
            </div>
        </section>
    );
}

export default SuccessMessage;
