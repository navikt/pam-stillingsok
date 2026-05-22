import type { SearchQuery } from "@/app/stillinger/(sok)/_utils/query";
import locations from "@/app/stillinger/(sok)/_utils/tmpABTestLocations";

const knownExtentValues = ["Heltid", "Deltid"];

function getSearchString(apiSearchQuery: SearchQuery) {
    return apiSearchQuery.q ? apiSearchQuery.q.join(" ") : "";
}

function containsPhrase(text: string, input: string) {
    // 1. Convert text and phrase to lowercase
    const cleanText = text.toLowerCase();
    const phrase = input.toLowerCase();

    // 2. Split both into arrays of individual words
    const wordsInText = cleanText.split(" ").filter((word) => word.length > 0);
    const words = phrase.split(" ").filter((word) => word.length > 0);

    // 3. If the word has more words than the text, it cannot be a match
    if (words.length > wordsInText.length) {
        return false;
    }

    // 4. Check if the words appear sequentially in the text
    for (let i = 0; i <= wordsInText.length - words.length; i++) {
        let isMatch = true;

        for (let j = 0; j < words.length; j++) {
            if (wordsInText[i + j] !== words[j]) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            return true;
        }
    }

    return false;
}

function removePhrase(text: string, phrase: string) {
    // 1. Convert to lowercase
    const cleanText = text.toLowerCase();
    const cleanPhrase = phrase.toLowerCase();

    // 2. Split both into word arrays based on spaces
    const wordsInText = cleanText.split(" ").filter((word) => word.length > 0);
    const phraseWords = cleanPhrase.split(" ").filter((word) => word.length > 0);

    // If the phrase has more words than the text, it cannot be a match
    if (phraseWords.length > wordsInText.length) {
        return text;
    }

    // 3. Find the starting index where the phrase words match sequentially
    let matchIndex = -1;

    for (let i = 0; i <= wordsInText.length - phraseWords.length; i++) {
        let isMatch = true;

        for (let j = 0; j < phraseWords.length; j++) {
            if (wordsInText[i + j] !== phraseWords[j]) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            matchIndex = i;
            break; // Stop at first match
        }
    }

    // 4. If the phrase was found, remove it from the original text
    if (matchIndex !== -1) {
        // Split the ORIGINAL text by spaces to preserve exact casing and remaining punctuation
        const originalWords = text.split(" ").filter((word) => word.length > 0);

        // Remove the phrase words from the original words array
        originalWords.splice(matchIndex, phraseWords.length);

        // Rejoin the remaining words and clean up any double spaces
        return originalWords.join(" ").replace(/\s+/g, " ").trim();
    }

    // Return the original text if no match was found
    return text;
}

export function tmpToApiQuery(query: SearchQuery): SearchQuery {
    const apiSearchQuery = {
        ...query,
    };

    knownExtentValues.forEach((extent) => {
        const searchString = getSearchString(apiSearchQuery);
        if (containsPhrase(searchString, extent)) {
            if (!apiSearchQuery.extent?.includes(extent)) {
                apiSearchQuery.extent = [...(apiSearchQuery.extent || []), extent];
            }
            apiSearchQuery.q = [removePhrase(searchString, extent)];
        }
    });

    locations.forEach((county) => {
        const searchString = getSearchString(apiSearchQuery);
        if (containsPhrase(searchString, county.key)) {
            if (!apiSearchQuery.counties?.includes(county.key)) {
                apiSearchQuery.counties = [...(apiSearchQuery.counties || []), county.key];
            }
            apiSearchQuery.q = [removePhrase(searchString, county.key)];
        }

        county.m.forEach((municipal) => {
            const searchString = getSearchString(apiSearchQuery);
            if (containsPhrase(searchString, municipal)) {
                if (!apiSearchQuery.municipals?.includes(`${county.key}.${municipal}`)) {
                    apiSearchQuery.municipals = [...(apiSearchQuery.municipals || []), `${county.key}.${municipal}`];
                    if (!apiSearchQuery.counties?.includes(county.key)) {
                        apiSearchQuery.counties = [...(apiSearchQuery.counties || []), county.key];
                    }
                }
                apiSearchQuery.q = [removePhrase(searchString, municipal)];
            }
        });
    });

    if (apiSearchQuery.q && apiSearchQuery.q.length === 1 && apiSearchQuery.q[0] === "") {
        delete apiSearchQuery.q;
    }

    // Postcode and distance are only relevant to search for if both are set
    if (!(apiSearchQuery.postcode && apiSearchQuery.postcode.length === 4 && apiSearchQuery.distance)) {
        delete apiSearchQuery.postcode;
        delete apiSearchQuery.distance;
    }

    return apiSearchQuery;
}
