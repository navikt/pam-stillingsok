export const isSkyraSurveyRendered = (element: HTMLElement | null): boolean => {
    if (!element) {
        return false;
    }

    if (element.shadowRoot && element.shadowRoot.childElementCount > 0) {
        return true;
    }

    if (element.childElementCount > 0) {
        return true;
    }

    return false;
};
