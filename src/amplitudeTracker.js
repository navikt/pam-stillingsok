import amplitude from 'amplitude-js';

const getCookie = (name) => {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : '';
};

const amplitudeIsEnabled = () => {
    return getCookie('amplitudeIsEnabled') === 'true';
};

if (amplitudeIsEnabled()) {
    amplitude.getInstance();
    amplitude.init(
        window.__AMPLITUDE_TOKEN__, null, {
            apiEndpoint: 'amplitude.nav.no/collect',
            batchEvents: false,
            includeReferrer: true,
            includeUtm: true,
            saveEvents: false
        }
    );
}

export const logAmplitudePageview = (additionalData) => {
    if (!amplitudeIsEnabled()) {return;}
    let data = {
        page: `${window.location.pathname}${window.location.search}`,
        title: document.title
    };

    if (additionalData) {
        data = {
            ...data,
            ...additionalData
        }
    }

    logAmplitudeEvent('Sidevisning', data);
};


const logAmplitudeEvent = (event, data) => {
    if (!amplitudeIsEnabled()) {return;}
    amplitude.logEvent(event, data);
};

export default logAmplitudeEvent;
