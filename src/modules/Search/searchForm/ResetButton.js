import React from "react";
import PropTypes from "prop-types";
import Button from "../../../components/Button/Button";

function ResetButton({ dispatch }) {
    function handleClick() {
        dispatch({ type: "RESET" });
    }

    return (
        <Button variant="secondary" type="button" onClick={handleClick} className="arb-button">
            Nullstill søk
        </Button>
    );
}

ResetButton.propTypes = {
    dispatch: PropTypes.func.isRequired
};

export default ResetButton;
