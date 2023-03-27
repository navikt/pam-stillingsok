import React from "react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../environment";
import "./EmptyMessage.css";

function EmptyMessage({ title, text }) {
    return (
        <section className="EmptyMessage">
            <h2 className="EmptyMessage__h2">{title}</h2>
            <p className="EmptyMessage__text">{text}</p>
            <p className="EmptyMessage__text">
                <Link to={CONTEXT_PATH}>Tilbake til søk</Link>
            </p>
        </section>
    );
}

export default EmptyMessage;
