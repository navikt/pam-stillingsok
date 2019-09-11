const predefinedSearches = [
    {
        documentTitle: 'Ledige stillinger i Oslo - Arbeidsplassen',
        query: '?counties[]=OSLO',
        city: 'Oslo'
    },
    {
        documentTitle: 'Ledige stillinger i Bergen - Arbeidsplassen',
        query: '?counties[]=HORDALAND&municipals[]=HORDALAND.BERGEN',
        city: 'Bergen'
    },
    {
        documentTitle: 'Ledige stillinger i Trondheim - Arbeidsplassen',
        query: '?counties[]=TR%C3%98NDELAG&municipals[]=TR%C3%98NDELAG.TRONDHEIM',
        city: 'Trondheim'
    },
    {
        documentTitle: 'Ledige stillinger i Tromsø - Arbeidsplassen',
        query: '?counties[]=TROMS&municipals[]=TROMS.TROMS%C3%98',
        city: 'Tromsø'
    }
];

exports.isPredefinedQuery = (query) => {
    return predefinedSearches.find((item) => item.query === query);
};

exports.isPredefinedDocumentTitle = (title) => {
    return predefinedSearches.find((item) => item.documentTitle === title);
};
