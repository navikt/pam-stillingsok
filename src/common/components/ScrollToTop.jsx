import React from "react";
import useScrollToTop from "../hooks/useScrollToTop";

function ScrollToTop({ children }) {
    useScrollToTop();

    return children;
}

export default ScrollToTop;
