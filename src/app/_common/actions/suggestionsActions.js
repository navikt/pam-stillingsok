"use server";

import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import logger from "@/app/_common/utils/logger";

/**
function suggest(field, match) {
    return {
        prefix: match,
        completion: {
            field,
            skip_duplicates: true,
            contexts: {
                status: "ACTIVE",
            },
            size: 10,
        },
    };
}

const suggestionsTemplate = (match, minLength) => ({
    suggest: {
        category_suggest: {
            ...suggest("category_name_suggest", match, minLength),
        },
        searchtags_suggest: {
            ...suggest("searchtags_suggest", match, minLength),
        },
    },
    _source: false,
});
 */

/**
 * Use new Set to remove duplicates across category_suggest and searchtags_suggest
 */
/**
function removeDuplicateSuggestions(result) {
    return [
        ...new Set(
            [
                ...result.suggest.searchtags_suggest[0].options.map((suggestion) =>
                    capitalizeFirstLetter(suggestion.text),
                ),
                ...result.suggest.category_suggest[0].options.map((suggestion) =>
                    capitalizeFirstLetter(suggestion.text),
                ),
            ].sort(),
        ),
    ].slice(0, 10);
}
*/

function extractSuggestions(resp) {
    return [...new Set([...resp.map((it) => it.label)])];
}

export async function getSuggestions(match) {
    try {
        const res = await fetch(`${process.env.PAMONTOLOGI_URL}/rest/typeahead/stilling?q=${match}`, {
            method: "GET",
            headers: getDefaultHeaders(),
        });
        let data = await res.json();
        data = extractSuggestions(data);
        return data;
    } catch (e) {
        logger.error("getSuggestions error", { error: e });
        return [];
    }
}
