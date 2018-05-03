export const tilpassLenke = (lenke) => {
    if(lenke.includes('@')) {
        return 'mailto:' + lenke;
    } else if(!lenke.startsWith('http')) {
        return 'https://' + lenke
    } else {
        return lenke;
    }
};

export const tilpassTwitterAdresse = (adresse) => {
    if(adresse.startsWith('@')) {
        return 'https://twitter.com/'+ adresse;
    } else if(!adresse.startsWith('http')) {
        return 'https://' + adresse
    } else {
        return adresse;
    }
};