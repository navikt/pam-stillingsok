const typeaheadTemplate = (match) => ({
    suggest: {
        yrkeskategori: {
            prefix: match,
            completion: {
                field: 'category_suggest',
                // skip_duplicates: true,
                contexts: {
                    status: 'ACTIVE'
                },
                size: 500
            }
        },
        searchtags: {
            prefix: match,
            completion: {
                field: 'searchtags_suggest',
                // skip_duplicates: true,
                contexts: {
                    status: 'ACTIVE'
                },
                size: 500
            }
        }
    },
    _source: false
});

export default typeaheadTemplate;
