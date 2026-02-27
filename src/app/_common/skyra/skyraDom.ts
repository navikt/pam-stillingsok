export const isSkyraSurveyRendered = (element: HTMLElement | null): boolean => {
    if (!element) {
        return false;
    }

    if (element.shadowRoot) {
        if (element.shadowRoot.querySelector("*")) {
            return true;
        }
    }

    // hvis Skyra renderer uten shadow, eller shadow er "closed"
    if (element.querySelector("*")) {
        return true;
    }

    return false;
};
