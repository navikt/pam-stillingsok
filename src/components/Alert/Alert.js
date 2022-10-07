import React from "react";
import "./Alert.css";

function Alert({ children }) {
    return (
        <p className="Alert" role="alert">
            {children}
        </p>
    );
}

export default Alert;
