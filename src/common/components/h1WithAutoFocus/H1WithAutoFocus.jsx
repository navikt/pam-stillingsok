import React, { useContext, useLayoutEffect, useRef } from "react";
import { HistoryContext } from "../../context/HistoryProvider";
import "./H1WithAutoFocus.css";
import { Heading } from "@navikt/ds-react";

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
            className={["H1WithAutoFocus", className].join(" ")}
            tabIndex={-1}
            spacing={spacing}
        >
            {children}
        </Heading>
    );
}

H1WithAutoFocus.propTypes = {};

export default H1WithAutoFocus;
