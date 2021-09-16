import React from 'react';
import { CONTEXT_PATH } from '../../fasitProperties';
import { parseQueryString, stringifyQueryObject } from '../../utils';

/**
 * Noen url'er er blitt manipulert slik at url'en fungerer som redirect-url ved login.
 * F.eks blir /stillinger/stilling/12345 omgjort til /stillinger/stilling?uuid=12345
 * Her formateres url'en tilbake til det orginale formatet før applikasjonen vises
 */
const FixUrlAfterLogin = ({ children }) => {
    const path = location.pathname;

    if (path === `${CONTEXT_PATH}/stilling`) {
        const {uuid, ...otherQueryParams} = parseQueryString(document.location.search);

        if (uuid && typeof uuid === "string") {
            window.history.replaceState({}, '', `${CONTEXT_PATH}/stilling/${uuid}${stringifyQueryObject(otherQueryParams)}`);
        }
    } else if (path === `${CONTEXT_PATH}/intern`) {
        const {uuid, ...otherQueryParams} = parseQueryString(document.location.search);

        if (uuid && typeof uuid === "string") {
            window.history.replaceState({}, '', `${CONTEXT_PATH}/intern/${uuid}${stringifyQueryObject(otherQueryParams)}`);
        }
    }

    return (
        <React.Fragment>
            { children }
        </React.Fragment>
    );
};

export default FixUrlAfterLogin;
