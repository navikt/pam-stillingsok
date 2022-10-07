import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";
import { CONTEXT_PATH } from "../../../environment";

export default function NotFound() {
    return (
        <section className="NotFound">
            <h1 className="NotFound__h1">Ikke funnet</h1>
            <p className="NotFound__text">Stillingsannonsen kan være utløpt eller blitt fjernet av arbeidsgiver.</p>
            <p className="NotFound__text">
                <Link to={CONTEXT_PATH} className="link">
                    Gå til ledige stillinger
                </Link>
            </p>
        </section>
    );
}
