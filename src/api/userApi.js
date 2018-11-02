import SearchApiError from '../api/SearchApiError';

const getCookie = (name) => {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : '';
};

export async function userApiGet(url) {
    let response;
    try {
        response = await fetch(url, {
            credentials: 'include',
            method: 'GET'
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export async function userApiPost(url, query) {
    let response;
    try {
        response = await fetch(url, {
            credentials: 'include',
            body: JSON.stringify(query),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN-ARBEIDSPLASSEN': getCookie('XSRF-TOKEN-ARBEIDSPLASSEN')
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export async function userApiPut(url, query) {
    let response;
    try {
        response = await fetch(url, {
            credentials: 'include',
            body: JSON.stringify(query),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN-ARBEIDSPLASSEN': getCookie('XSRF-TOKEN-ARBEIDSPLASSEN')
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export async function userApiRemove(url) {
    let response;
    try {
        response = await fetch(url, {
            credentials: 'include',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN-ARBEIDSPLASSEN': getCookie('XSRF-TOKEN-ARBEIDSPLASSEN')
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response;
}
