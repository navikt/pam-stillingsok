import React from "react";
import PropTypes from "prop-types";
import { Knapp } from "@navikt/arbeidsplassen-knapper";

function ResetButton({ dispatch }) {
    function handleClick() {
        dispatch({ type: "RESET" });
    }

    return (
        <Knapp htmlType="button" onClick={handleClick}>
            Nullstill søk
        </Knapp>
    );
}

ResetButton.propTypes = {
    dispatch: PropTypes.func.isRequired
};

export default ResetButton;
