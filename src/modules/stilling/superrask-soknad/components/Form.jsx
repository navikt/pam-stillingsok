import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
    BodyLong,
    Button,
    Checkbox,
    ErrorSummary,
    Fieldset,
    Heading,
    HStack,
    Link as AkselLink,
    ReadMore,
    Textarea,
    TextField,
} from "@navikt/ds-react";
import { Link } from "react-router-dom";
import H1WithAutoFocus from "../../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import { MOTIVATION_MAX_LENGTH } from "./validateForm";
import ApiErrorMessage from "./ApiErrorMessage";

function Form({ ad, applicationForm, submitForm, pending, submitApiError, validationErrors }) {
    const errorSummary = useRef();
    const [hideMotivationError, setHideMotivationError] = useState(false);
    const [hideEmailError, setHideEmailError] = useState(false);
    const [hideTelephoneError, setHideTelephoneError] = useState(false);

    useEffect(() => {
        if (Object.keys(validationErrors).length > 0) {
            errorSummary.current.focus();
        }
        setHideMotivationError(false);
        setHideEmailError(false);
        setHideTelephoneError(false);
    }, [validationErrors]);

    return (
        <form onSubmit={submitForm} className="mb-16">
            <input type="text" />
            <button type="submit">ads</button>
        </form>
    );
}

Form.propTypes = {
    ad: PropTypes.shape({
        _id: PropTypes.string,
        _source: PropTypes.shape({
            title: PropTypes.string,
        }),
    }).isRequired,
    applicationForm: PropTypes.shape({
        qualifications: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                label: PropTypes.string,
            }),
        ),
    }).isRequired,
    submitForm: PropTypes.func.isRequired,
    pending: PropTypes.bool,
    submitApiError: PropTypes.shape({
        message: PropTypes.string,
    }),
    validationErrors: PropTypes.shape({
        email: PropTypes.string,
        telephone: PropTypes.string,
        motivation: PropTypes.string,
    }),
};

export default Form;
