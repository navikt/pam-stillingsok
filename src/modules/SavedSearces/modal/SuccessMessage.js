import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../environment";
import Button from "../../../components/Button/Button";

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
                <Link className="link" to={`${CONTEXT_PATH}/lagrede-sok`}>
                    Lagrede søk.
                </Link>
            </p>
            <div className="SaveSearchForm__buttons">
                <Button variant="primary" ref={buttonRef} onClick={onClose}>
                    Lukk
                </Button>
            </div>
        </section>
    );
}

export default SuccessMessage;
