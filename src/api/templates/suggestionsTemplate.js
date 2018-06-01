function suggest(field, match, minLength) {
    return {
        prefix: match,
        completion: {
            field,
            skip_duplicates: true,
            contexts: {
                status: 'ACTIVE'
            },
            size: 5,
            fuzzy: {
                prefix_length: minLength
            }
        }
    };
}
const suggestionsTemplate = (match, minLength) => ({
    suggest: {
        category_suggest: {
            ...suggest('category_suggest', match, minLength)
        },
        searchtags_suggest: {
            ...suggest('searchtags_suggest', match, minLength)
        }
    },
    _source: false
});

export default suggestionsTemplate;
