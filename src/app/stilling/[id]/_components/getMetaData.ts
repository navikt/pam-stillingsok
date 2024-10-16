import getWorkLocation from "@/app/_common/utils/getWorkLocation";
import { getMetadataTitle } from "@/constants/layout";
import formatISOString from "@/app/_common/utils/date";
import { MappedAdDTO } from "@/app/stilling/_data/types";

export function getStillingTitle(title: string | undefined): string {
    if (title) {
        return getMetadataTitle(title);
    }
    return getMetadataTitle("Ledig stilling");
}

export function getSuperraskTitle(source: MappedAdDTO): string {
    if (source && source.title) {
        return getMetadataTitle(`Superrask søknad - ${source.title}`);
    }
    return getMetadataTitle("Superrask søknad");
}

export function getStillingDescription(source: MappedAdDTO | undefined): string {
    if (source) {
        const descriptionFragments = [];
        const employer = source.employer.name;
        const location = getWorkLocation(source.location, source.locationList);

        const commaSeparatedFragments = [];
        if (source.jobTitle && source.title !== source.jobTitle) {
            commaSeparatedFragments.push(source.jobTitle);
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

        if (source.applicationDue) {
            const applicationDue = formatISOString(source.applicationDue, "DD.MM.YYYY");
            descriptionFragments.push(`Søknadsfrist: ${applicationDue}`);
        }

        return `${descriptionFragments.join(". ")}.`;
    }

    return "Her kan du se hele stillingen, sende søknad eller finne andre ledige stillinger.";
}
