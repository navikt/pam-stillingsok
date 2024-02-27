import getEmployer from "@/app/_common/utils/getEmployer";
import getWorkLocation from "@/app/_common/utils/getWorkLocation";
import date from "@/app/_common/utils/date";
import { getMetadataTitle } from "@/app/layout";

export function getStillingTitle(source) {
    if (source && source.title) {
        return getMetadataTitle(source.title);
    }
    return getMetadataTitle("Ledig stilling");
}

export function getSuperraskTitle(source) {
    if (source && source.title) {
        return getMetadataTitle("Superrask søknad - " + source.title);
    }
    return getMetadataTitle("Superrask søknad");
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

    return "Her kan du se hele stillingen, sende søknad eller finne andre ledige stillinger.";
}
