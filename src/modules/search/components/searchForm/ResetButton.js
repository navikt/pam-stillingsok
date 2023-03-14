import React from "react";
import PropTypes from "prop-types";
import { Button } from "@navikt/ds-react";

function ResetButton({ dispatch }) {
    function handleClick() {
        dispatch({ type: "RESET" });
    }

    return (
        <Button variant="secondary" type="button" onClick={handleClick}>
            Nullstill søk
        </Button>
    );
}

ResetButton.propTypes = {
    dispatch: PropTypes.func.isRequired
};

export default ResetButton;
