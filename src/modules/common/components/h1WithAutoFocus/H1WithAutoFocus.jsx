import React, { useContext, useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Heading } from "@navikt/ds-react";
import { HistoryContext } from "../../context/HistoryProvider";

/**
 * This view sets focus to h1 title when navigating to a new page.
 *
 * Reason: When navigating between pages in a single page app, screen reader will not
 * announce that a new page is loaded, as it would do when loading a page from server.
 * Focus is also lost somewhere in the DOM. Setting focus to h1 may improve this.
 */
function H1WithAutoFocus({ children, className, spacing = true, size = "xlarge" }) {
    const ref = useRef(null);
    const { hasHistory } = useContext(HistoryContext);

    useLayoutEffect(() => {
        if (hasHistory) {
            if (ref.current) {
                ref.current.focus();
            }
        }
    }, []);

    return (
        <Heading
            level="1"
            size={size}
            ref={ref}
            className={["no-focus-outline", className].join(" ")}
            tabIndex={-1}
            spacing={spacing}
        >
            {children}
        </Heading>
    );
}

H1WithAutoFocus.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    className: PropTypes.string,
    spacing: PropTypes.bool,
    size: PropTypes.string,
};

export default H1WithAutoFocus;