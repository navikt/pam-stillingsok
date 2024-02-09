import getEmployer from "../../../_common/utils/getEmployer";
import getWorkLocation from "../../../_common/utils/getWorkLocation";
import date from "../../../_common/utils/date";

const DEFAULT_DESCRIPTION_STILLING = "Her kan du se hele stillingen, sende søknad eller finne andre ledige stillinger.";
const DEFAULT_TITLE = "Ledig stilling - arbeidsplassen.no";

export function getTitle(title) {
    if (title) {
        return `${title} - arbeidsplassen.no`;
    }
    return DEFAULT_TITLE;
}

export function getStillingTitle(source) {
    if (source && source.title) {
        return `${source.title} - arbeidsplassen.no`;
    }
    return DEFAULT_TITLE;
}

export function getStillingDescription(source) {
    if (source && source.properties) {
        const descriptionFragments = [];
        const employer = getEmployer(source);
        const location = getWorkLocation(source.properties.location, source.locationList);

        const commaSeparatedFragments = [];
        if (source.properties.jobtitle && source.title !== source.properties.jobtitle) {
            commaSeparatedFragments.push(source.properties.jobtitle);
        }
        if (employer) {
            commaSeparatedFragments.push(employer);
        }
        if (location) {
            commaSeparatedFragments.push(location);
        }

        if (commaSeparatedFragments.length > 0) {
            descriptionFragments.push(commaSeparatedFragments.join(", "));
        }

        if (source.properties.applicationdue) {
            const applicationDue = date.formatISOString(source.properties.applicationdue, "DD.MM.YYYY");
            descriptionFragments.push(`Søknadsfrist: ${applicationDue}`);
        }

        return `${descriptionFragments.join(". ")}.`;
    }

    return DEFAULT_DESCRIPTION_STILLING;
}

export const defaultOpenGraphImage = {
    url: "https://arbeidsplassen.nav.no/images/arbeidsplassen-open-graph.png",
    width: 1200,
    height: 630,
};
