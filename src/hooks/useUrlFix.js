import { parseQueryString, stringifyQueryObject } from "../utils/utils";
import { CONTEXT_PATH } from "../environment";

export default () => {
    // Om man logget inn mens man var inne på en stillingsannonse, så vil loginservice
    // redirecte til en url med dette url-formatet: '/stillinger/stilling?uuid=12345'.
    // Redirecter derfor til riktig url-format: '/stillinger/stilling/:uuid'
    if (window.location.pathname === `${CONTEXT_PATH}/stilling`) {
        const { uuid, ...otherQueryParams } = parseQueryString(document.location.search);
        window.history.replaceState(
            {},
            "",
            `${CONTEXT_PATH}/stilling/${uuid}${stringifyQueryObject(otherQueryParams)}`
        );
    } else if (window.location.pathname === `${CONTEXT_PATH}/intern`) {
        const { uuid, ...otherQueryParams } = parseQueryString(document.location.search);
        window.history.replaceState({}, "", `${CONTEXT_PATH}/intern/${uuid}${stringifyQueryObject(otherQueryParams)}`);
    }
};
