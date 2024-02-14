/**
 * Decodes and parses a query string, f.ex "?q=javascript&counties[]=OSLO".
 * @return a query object, f.ex {"q":"javascript","counties":["OSLO"]}.
 */
// Todo: test at man kan søke på ?q=50% og deretter logge inn. Sjekk at 50% er decoded riktig etter login
function extractQueryParameters(encodedQueryString) {
    let decodeQueryString = encodedQueryString;

    // After login, the redirect url back to this page may have been encoded several times.
    // This function decodes url until it is no longer contains '%', for example %20 (space).
    // When url is fully decoded, it can try to decode again if the url
    // contains the percentage sign itself, and decode attempt will fail.
    // This can happen for example when searching for part-time job '?=50%'.
    try {
        while (decodeQueryString.includes("%")) {
            decodeQueryString = decodeURIComponent(decodeQueryString);
        }
    } catch (e) {
        // Ignore failed decode attempt
    }

    // Extract query parameters
    const urlParameters = decodeQueryString.substring(1).split("&");
    const query = {};
    urlParameters.forEach((parameter) => {
        const pair = parameter.split("=");
        if (pair[0] !== undefined && pair[0] !== "") {
            let key = pair[0];
            const val = pair[1] !== undefined ? pair[1] : "";

            if (key === "international") {
                query[key] = val === "true" ? true : "false";
            } else if (key.includes("[]")) {
                key = key.replace("[]", "");

                if (query[key] === undefined) {
                    query[key] = [val];
                } else {
                    query[key].push(val);
                }
            } else {
                query[key] = val;
            }
        }
    });
    return query;
}
