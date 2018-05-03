export const fromUrl = function fromUrl(url) {
    const urlParametere = url.substring(1).split('&');
    const stillingtyper = [];
    const steder = [];
    const hd = [];
    const forhold = [];
    let p;
    let itemsPerPage;
    let sokeord = '';
    let sort;
    let frist = '';
    let regdato = '';
    let hash = '';
    for (let i = 0; i < urlParametere.length; i += 1) {
        const urlParameter = urlParametere[i];
        if (urlParameter.startsWith('p=')) {
            p = parseInt(urlParameter.split('=')[1], 10);
        }
        if (urlParameter.startsWith('q=')) {
            sokeord = urlParameter.split('=')[1];
            sokeord = decodeURIComponent(sokeord);
        }
        if (urlParameter.startsWith('rpp=')) {
            itemsPerPage = urlParameter.split('=')[1];
        }
        if (urlParameter.startsWith('sort=')) {
            sort = urlParameter.split('=')[1];
        }
        if (urlParameter.startsWith('hd=')) {
            hd.push(urlParameter.split('=')[1]);
        }
        if (urlParameter.startsWith('af=')) {
            forhold.push(urlParameter.split('=')[1]);
        }
        if (urlParameter.startsWith('sf=')) {
            frist = urlParameter.split('=')[1];
        }
        if (urlParameter.startsWith('ad=')) {
            regdato = urlParameter.split('=')[1];
        }
        if (urlParameter.startsWith('hash=')) {
            hash = urlParameter.split('=')[1];
        }
        if (urlParameter.match(/s(\d)=([^]+)/)) {
            stillingtyper.push(urlParameter);
        }
        if (urlParameter.match(/l(\d)=([^]+)/)) {
            steder.push(urlParameter);
        }
    }

    return {
        stillingtyper,
        steder,
        hd,
        forhold,
        p,
        sokeord,
        frist,
        regdato,
        itemsPerPage,
        sort,
        hash
    };
};

export const toUrl = function toUrl(searchCriteria) {
    let urlParameters = `?q=${searchCriteria.sokeord}`;
    if (searchCriteria.p !== undefined) {
        urlParameters += `&p=${searchCriteria.p}`;
    }
    if (searchCriteria.stillingtyper.length > 0) {
        urlParameters += `&${searchCriteria.stillingtyper.join('&')}`;
    }
    if (searchCriteria.steder.length > 0) {
        urlParameters += `&${searchCriteria.steder.join('&')}`;
    }
    if (searchCriteria.hd.length > 0) {
        urlParameters += `&hd=${searchCriteria.hd.join('&hd=')}`;
    }
    if (searchCriteria.forhold.length > 0) {
        urlParameters += `&af=${searchCriteria.forhold.join('&af=')}`;
    }
    if (searchCriteria.frist !== '') {
        urlParameters += `&sf=${searchCriteria.frist}`;
    }
    if (searchCriteria.regdato !== '') {
        urlParameters += `&ad=${searchCriteria.regdato}`;
    }
    if (searchCriteria.sort !== undefined) {
        urlParameters += `&sort=${searchCriteria.sort}`;
    }
    if (searchCriteria.itemsPerPage !== undefined) {
        urlParameters += `&rpp=${searchCriteria.itemsPerPage}`;
    }

    return urlParameters;
};
