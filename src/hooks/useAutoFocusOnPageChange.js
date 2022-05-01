import { useContext, useLayoutEffect, useRef } from "react";
import { HasHistoryContext } from "../context/HasHistoryProvider";

/**
 * This hook sets focus to for example h1 title when navigating to a new page.
 *
 * Reason: When navigating between pages in a single page app, screen reader will not
 * announce that a new page is loaded, as it would do when loading a page from server.
 * Focus is also lost somewhere in the DOM. Setting focus to h1 may improve this.
 *
 * @return ref - use it as a ref in the element that should get focus when page is shown, for example a h1.
 */
export default function useAutoFocusOnPageChange(shouldFocus = true) {
    const ref = useRef(null);
    const { hasHistory } = useContext(HasHistoryContext);

    useLayoutEffect(() => {
        if (hasHistory && shouldFocus) {
            if (ref.current) {
                ref.current.focus();
            }
        }
    }, [shouldFocus]);

    return ref;
}
