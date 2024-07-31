"use client";

import React from "react";
import PropTypes from "prop-types";
import { NotFound } from "@navikt/arbeidsplassen-react";

export default function MaxQuerySizeExceeded({ title, text }) {
    return (
        <div className="container-large mt-12 mb-12">
            <NotFound title={title} text={text} />
        </div>
    );
}

MaxQuerySizeExceeded.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
};
