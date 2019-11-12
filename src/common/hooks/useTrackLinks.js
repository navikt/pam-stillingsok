import {useEffect} from "react";

const setGAEventHandler = (element, gaId) => {
    element.addEventListener('click', () => {
        if (!gaId) return;
        console.log(gaId);
        ga('send', 'event', {
            eventCategory: 'Interaksjon',
            eventAction: 'Klikket lenke',
            eventLabel: gaId,
            transport: 'beacon'
        });
    });
};

export default () => {
    useEffect(() => {
        try {
            const elements = document.querySelectorAll('[data-ga-id]');
            for (let i = 0; i < elements.length; i += 1) {
                const gaId = elements[i].dataset.gaId;
                setGAEventHandler(elements[i], gaId);
            }
        } catch (e) {
            // Google Analytics er ikke definert (dette skjer f.eks. om en bruker blokkerer tracking).
        }
    });
};
